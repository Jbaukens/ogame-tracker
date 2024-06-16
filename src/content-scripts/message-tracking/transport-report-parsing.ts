import { _logDebug, _logError } from "../../shared/utils/_log";
import { _throw } from "../../shared/utils/_throw";
import { addOrSetCustomMessageContent, cssClasses, tabIds, formatNumber } from "./utils";
import { parseIntSafe } from "../../shared/utils/parseNumbers";
import { getMessageAttributes } from "../../shared/utils/getMessageAttributes";

let tabContent: Element | null = null;

export function initTransportMessageParsing() {
    const contentElem = document.querySelector('.content') ?? _throw('Cannot find content element');
    const initObserver = new MutationObserver(() => {
        if (tabContent?.isConnected != true) {
            setupObserver();
        }
    });
    initObserver.observe(contentElem, { subtree: true, childList: true });
}

function setupObserver() {
    tabContent = document.querySelector(`.messagesHolder`);
    const tabContentElement = tabContent ?? _throw('Cannot find messages holder element for transport messages');

    const observer = new MutationObserver(() => trackTransportReports(tabContentElement));
    observer.observe(tabContentElement, { childList: true, subtree: false });
}

function trackTransportReports(elem: Element) {
    const transportTab = document.querySelector(`.innerTabItem.active[data-subtab-id="${tabIds.transport}"]`);
    if (transportTab == null) {
        return;
    }

    const messages = Array.from(elem.querySelectorAll('div.msg[data-msg-id]'))
        .filter(elem => {
            const messageType = elem.querySelector('.rawMessageData')?.getAttribute('data-raw-messagetype');
            return !elem.classList.contains(cssClasses.messages.base) && messageType === "33";
        });

    
    messages.forEach(msg => {
        try {
            const element = msg.querySelector('.rawMessageData') ?? _throw(`Cannot find rawMessageData element`);
            const attributes = getMessageAttributes(element); 
            _logDebug(attributes);

            msg.classList.add(cssClasses.messages.transportReport);
            
            const cargoString = attributes['cargo'];
            const cargoData: any = JSON.parse(cargoString);

            const metal = cargoData.metal ?? 0;
            const crystal = cargoData.crystal ?? 0;
            const deuterium = cargoData.deuterium ?? 0;

            // mark message as "waiting for result"
            msg.classList.add(
                cssClasses.messages.base,
                cssClasses.messages.waitingToBeProcessed,
            );

            addOrSetCustomMessageContent(msg, `
                <div class="ogame-tracker-transport-report">
                    <div class="resource-units">
                        <div class="ogame-tracker-resource metal"></div>
                        <div class="${metal == 0 ? 'no-resources' : 'metal'}">${formatNumber(metal)}</div>
                        <div class="ogame-tracker-resource crystal"></div>
                        <div class="${crystal == 0 ? 'no-resources' : 'crystal'}">${formatNumber(crystal)}</div>
                        <div class="ogame-tracker-resource deuterium"></div>
                        <div class="${deuterium == 0 ? 'no-resources' : 'deuterium'}">${formatNumber(deuterium)}</div>
                    </div>
                </div>
            `);

            msg.classList.remove(cssClasses.messages.waitingToBeProcessed);
            msg.classList.add(cssClasses.messages.processed);
        } catch (error) {
            _logError(error);
        }
    });
}