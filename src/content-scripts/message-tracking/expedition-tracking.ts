import { parse } from "date-fns";
import { Message } from "../../shared/messages/Message";
import { MessageType } from "../../shared/messages/MessageType";
import { ExpeditionMessage, TrackExpeditionMessage } from "../../shared/messages/tracking/expeditions";
import { dateTimeFormat } from "../../shared/ogame-web/constants";
import { getOgameMeta } from "../../shared/ogame-web/getOgameMeta";
import { isSupportedLanguage } from "../../shared/i18n/isSupportedLanguage";
import { _log, _logDebug, _logWarning } from "../../shared/utils/_log";
import { _throw } from "../../shared/utils/_throw";
import { tabIds, cssClasses, addOrSetCustomMessageContent, formatNumber } from "./utils";
import { ExpeditionEvent, ExpeditionEventResources, ExpeditionFindableShipType } from "../../shared/models/v1/expeditions/ExpeditionEvents";
import { ExpeditionEventType } from "../../shared/models/v1/expeditions/ExpeditionEventType";
import { ExpeditionEventSize } from "../../shared/models/v1/expeditions/ExpeditionEventSize";
import { ResourceType } from "../../shared/models/v1/ogame/resources/ResourceType";
import { Items } from "../../shared/models/v1/ogame/items/Items";

export function initExpeditionTracking() {
    setupCommunication();

    const contentElem = document.querySelector('#content .content') ?? _throw('Cannot find content element');
    const initObserver = new MutationObserver(() => {
        const fleetsTab = document.querySelector('#fleetsTab');
        if (fleetsTab != null) {
            initObserver.disconnect();
            setupExpeditionMessageObserver();
        }
    });
    initObserver.observe(contentElem, { subtree: true, childList: true });
}

function setupExpeditionMessageObserver() {
    const tabLabel = document.querySelector(`[id^="subtabs-"][data-tabid="${tabIds.expedition}"]`) ?? _throw('Cannot find label of expedition messages');
    const tabContentId = tabLabel.getAttribute('aria-controls') ?? _throw('Cannot find id of expedition messages tab content');
    const tabContent = document.querySelector(`#${tabContentId}`) ?? _throw('Cannot find content element of expedition messages');

    const meta = getOgameMeta();
    if (isSupportedLanguage(meta.language)) {
        const observer = new MutationObserver(() => trackExpeditions(tabContent));
        observer.observe(tabContent, { childList: true, subtree: true });
    }
}

function setupCommunication() {
    chrome.runtime.onMessage.addListener(message => onMessage(message));
}

function onMessage(message: Message<MessageType, any>) {
    switch (message.type) {
        case MessageType.Expedition:
        case MessageType.NewExpedition: {
            const msg = message as ExpeditionMessage;
            const li = document.querySelector(`li.msg[data-msg-id="${msg.data.id}"]`) ?? _throw(`failed to find expedition message with id '${msg.data.id}'`);

            li.classList.remove(cssClasses.messages.waitingToBeProcessed);
            li.classList.add(cssClasses.messages.processed);
            addExpeditionResultContent(li, msg.data);
            break;
        }
    }
}

function trackExpeditions(elem: Element) {
    const messages = Array.from(elem.querySelectorAll('li.msg[data-msg-id]'))
        .filter(elem => !elem.classList.contains(cssClasses.messages.base));

    messages.forEach(msg => {
        try {
            // prepare message to service worker
            const id = parseInt(msg.getAttribute('data-msg-id') ?? _throw('Cannot find message id'));
            if (isNaN(id)) {
                _throw('Message id is NaN');
            }

            const dateText = msg.querySelector('.msg_head .msg_date')?.textContent ?? _throw('Cannot find message date');
            const date = parse(dateText, dateTimeFormat, new Date()).getTime();
            if (isNaN(date)) {
                _throw('Message date is NaN');
            }

            const messageTextElem = msg.querySelector('.msg_content') ?? _throw('Cannot find message content element');
            const text = messageTextElem.textContent ?? '';
            const html = messageTextElem.innerHTML;

            // send message to service worker
            const workerMessage: TrackExpeditionMessage = {
                type: MessageType.TrackExpedition,
                ogameMeta: getOgameMeta(),
                data: {
                    id,
                    date,
                    text,
                    html,
                },
            };
            chrome.runtime.sendMessage(workerMessage);

            // mark message as "waiting for result"
            msg.classList.add(
                cssClasses.messages.base,
                cssClasses.messages.waitingToBeProcessed,
                cssClasses.messages.hideContent,
            );
            addOrSetCustomMessageContent(msg, `<div class="ogame-tracker-loader"></div>`);
        } catch (error) {
            console.error(error);

            msg.classList.add(cssClasses.messages.base, cssClasses.messages.error);
            msg.classList.remove(cssClasses.messages.hideContent);
            addOrSetCustomMessageContent(msg, false);
        }
    });
}

function addExpeditionResultContent(li: Element, expedition: ExpeditionEvent) {
    li.classList.add(cssClasses.messages.expedition);

    switch (expedition.type) {
        case ExpeditionEventType.resources: {
            const resources = expedition.resources;
            let resource: ResourceType;
            let amount: number;
            if (resources.metal > 0) {
                [resource, amount] = [ResourceType.metal, resources.metal];
            } else if (resources.crystal > 0) {
                [resource, amount] = [ResourceType.crystal, resources.crystal];
            } else {
                [resource, amount] = [ResourceType.deuterium, resources.deuterium];
            }

            addOrSetCustomMessageContent(li, `
                <div class="${getResultClass(ExpeditionEventType.resources, expedition.size)}">
                    <div class="${getSizeIconClass(expedition.size)}"></div>
                    <div class="ogame-tracker-resource ${resource}"></div>
                    <div class="${resource}">${formatNumber(amount)}</div>
                </div>
            `);
            break;
        }

        case ExpeditionEventType.fleet: {
            const ships = Object.keys(expedition.fleet)
                .map(ship => parseInt(ship) as ExpeditionFindableShipType)
                .filter(key => (expedition.fleet[key] ?? 0) > 0);

            addOrSetCustomMessageContent(li, `
                <div class="${getResultClass(ExpeditionEventType.fleet, expedition.size)}">
                    <div class="${getSizeIconClass(expedition.size)}"></div>
                    ${ships.map(ship => `
                        <div class="ship-count-item">
                            <div class="ogame-tracker-ship ship-${ship}"></div>
                            <div>${formatNumber(expedition.fleet[ship] ?? 0)}</div>
                        </div>
                    `).join('')}
                </div>
            `);
            break;
        }

        case ExpeditionEventType.darkMatter: {
            addOrSetCustomMessageContent(li, `
                <div class="${getResultClass(ExpeditionEventType.darkMatter, expedition.size)}">
                    <div class="${getSizeIconClass(expedition.size)}"></div>
                    <div class="ogame-tracker-resource dark-matter"></div>
                    <div class="dark-matter">${formatNumber(expedition.darkMatter)}</div>
                </div>
            `);
            break;
        }

        case ExpeditionEventType.delay: {
            addOrSetCustomMessageContent(li, `
                <div class="${getResultClass(ExpeditionEventType.delay)}">
                    <div class="mdi mdi-clock-outline"></div>
                </div>
            `);
            break;
        }

        case ExpeditionEventType.early: {
            addOrSetCustomMessageContent(li, `
                <div class="${getResultClass(ExpeditionEventType.early)}">
                    <div class="mdi mdi-clock-outline"></div>
                </div>
            `);
            break;
        }

        case ExpeditionEventType.pirates: {
            addOrSetCustomMessageContent(li, `
                <div class="${getResultClass(ExpeditionEventType.pirates, expedition.size)}">
                    <div class="${getSizeIconClass(expedition.size)}"></div>
                    <div class="mdi mdi-pirate"></div>
                </div>
            `);
            break;
        }

        case ExpeditionEventType.aliens: {
            addOrSetCustomMessageContent(li, `
                <div class="${getResultClass(ExpeditionEventType.aliens, expedition.size)}">
                    <div class="${getSizeIconClass(expedition.size)}"></div>
                    <div class="mdi mdi-alien"></div>
                </div>
            `);
            break;
        }

        case ExpeditionEventType.lostFleet: {
            addOrSetCustomMessageContent(li, `
                <div class="${getResultClass(ExpeditionEventType.lostFleet)}">
                    <div class="mdi mdi-cross"></div>
                    <div class="mdi mdi-skull-crossbones"></div>
                </div>
            `);
            break;
        }

        case ExpeditionEventType.nothing: {
            addOrSetCustomMessageContent(li, '-');
            break;
        }

        case ExpeditionEventType.item: {
            const item = Items[expedition.itemHash];
            const imageUrl = chrome.runtime.getURL(`/img/ogame/items/${item.image}.png`);
            //TODO: item
            addOrSetCustomMessageContent(li, `
                <div class="${getResultClass(ExpeditionEventType.item)}">
                    <img src="${imageUrl}" class="item-grade--${item.grade}" />
                </div>
            `);
            break;
        }

        case ExpeditionEventType.trader: {
            addOrSetCustomMessageContent(li, `
                <div class="${getResultClass(ExpeditionEventType.trader)}">
                    <div class="mdi mdi-swap-horizontal-bold"></div>
                </div>
            `);
            break;
        }
    }
}

function getSizeIconClass(size: ExpeditionEventSize) {
    return 'ogame-tracker-expedition--size-icon mdi ' + ({
        [ExpeditionEventSize.small]: 'mdi-signal-cellular-1',
        [ExpeditionEventSize.medium]: 'mdi-signal-cellular-2',
        [ExpeditionEventSize.large]: 'mdi-signal-cellular-3',
    }[size]);
}

function getResultClass(result: ExpeditionEventType, size?: ExpeditionEventSize) {
    const cssClass = `ogame-tracker-expedition-result ogame-tracker-expedition-result--${result}`;
    if (size == null) {
        return cssClass;
    }

    return `${cssClass} ogame-tracker-expedition-result--size-${size}`;
}