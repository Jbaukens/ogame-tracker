import { sendMessage } from "@/shared/communication/sendMessage";
import { _logError } from "@/shared/utils/_log";
import { empireTrackingUuid } from "@/shared/uuid";
import { MessageType } from "../../shared/messages/MessageType";
import { UpdateAllianceClassMessage, UpdatePlanetBuildingLevelsMessage, UpdatePlanetProductionSettingsMessage, UpdatePlanetShipCountsMessage, UpdateResearchLevelsMessage } from "../../shared/messages/tracking/empire";
import { CrawlerProductionPercentage } from "../../shared/models/empire/CrawlerProductionPercentage";
import { ProductionPercentage } from "../../shared/models/empire/ProductionPercentage";
import { BuildingType } from "../../shared/models/ogame/buildings/BuildingType";
import { AllianceClass } from "../../shared/models/ogame/classes/AllianceClass";
import { ResearchType } from "../../shared/models/ogame/research/ResearchType";
import { ShipType } from "../../shared/models/ogame/ships/ShipType";
import { getOgameMeta } from "../../shared/ogame-web/getOgameMeta";
import { parseIntSafe } from "../../shared/utils/parseNumbers";
import { _throw } from "../../shared/utils/_throw";
import { observerCallbacks } from "./main";

export function trackResourceSettingsPage(): void {
    observerCallbacks.push({
        selector: '#inhalt .mainRS',
        callback: element => {
            const planetIdText = (document.querySelector('meta[name="ogame-planet-id"]') as HTMLMetaElement | null)?.content
                ?? _throw('no meta element found for ogame-planet-id');
            const planetId = parseIntSafe(planetIdText, 10);

            const planetType = (document.querySelector('meta[name="ogame-planet-type"]') as HTMLMetaElement | null)?.content
                ?? _throw('did not find meta ogame-planet-type');
            const isMoon = planetType == 'moon';

            try {
                const buildingsMessage: UpdatePlanetBuildingLevelsMessage = {
                    ogameMeta: getOgameMeta(),
                    type: MessageType.UpdatePlanetBuildingLevels,
                    data: {
                        isMoon,
                        planetId,
                        data: {
                            [BuildingType.metalMine]: getLevelOrAmount(element, BuildingType.metalMine),
                            [BuildingType.crystalMine]: getLevelOrAmount(element, BuildingType.crystalMine),
                            [BuildingType.deuteriumSynthesizer]: getLevelOrAmount(element, BuildingType.deuteriumSynthesizer),
                            [BuildingType.fusionReactor]: getLevelOrAmount(element, BuildingType.fusionReactor),
                            [BuildingType.solarPlant]: getLevelOrAmount(element, BuildingType.solarPlant),
                        },
                    },
                    senderUuid: empireTrackingUuid,
                };
                sendMessage(buildingsMessage);
            }
            catch (err) {
                _logError(err);
            }


            try {
                const solSatMessage: UpdatePlanetShipCountsMessage = {
                    ogameMeta: getOgameMeta(),
                    type: MessageType.UpdatePlanetShipCounts,
                    data: {
                        isMoon,
                        planetId,
                        data: {
                            [ShipType.solarSatellite]: getLevelOrAmount(element, ShipType.solarSatellite),
                        },
                    },
                    senderUuid: empireTrackingUuid,
                };
                sendMessage(solSatMessage);
            }
            catch (err) {
                _logError(err);
            }


            try {
                const researchMessage: UpdateResearchLevelsMessage = {
                    ogameMeta: getOgameMeta(),
                    type: MessageType.UpdateResearchLevels,
                    data: {
                        [ResearchType.plasmaTechnology]: getLevelOrAmount(element, ResearchType.plasmaTechnology),
                    },
                    senderUuid: empireTrackingUuid,
                };
                sendMessage(researchMessage);
            }
            catch (err) {
                _logError(err);
            }


            try {
                const allyClassMessage: UpdateAllianceClassMessage = {
                    ogameMeta: getOgameMeta(),
                    type: MessageType.UpdateAllianceClass,
                    data: getAllianceClass(element),
                    senderUuid: empireTrackingUuid,
                };
                sendMessage(allyClassMessage);
            }
            catch (err) {
                _logError(err);
            }


            try {
                const productionSettingsMessage: UpdatePlanetProductionSettingsMessage = {
                    ogameMeta: getOgameMeta(),
                    type: MessageType.UpdatePlanetProductionSettings,
                    data: {
                        isMoon,
                        planetId,
                        data: {
                            [BuildingType.metalMine]: getProductionPercentage(element, BuildingType.metalMine) as ProductionPercentage,
                            [BuildingType.crystalMine]: getProductionPercentage(element, BuildingType.crystalMine) as ProductionPercentage,
                            [BuildingType.deuteriumSynthesizer]: getProductionPercentage(element, BuildingType.deuteriumSynthesizer) as ProductionPercentage,
                            [BuildingType.solarPlant]: getProductionPercentage(element, BuildingType.solarPlant) as ProductionPercentage,
                            [BuildingType.fusionReactor]: getProductionPercentage(element, BuildingType.fusionReactor) as ProductionPercentage,
                            [ShipType.solarSatellite]: getProductionPercentage(element, ShipType.solarSatellite) as ProductionPercentage,
                            [ShipType.crawler]: getProductionPercentage(element, ShipType.crawler) as CrawlerProductionPercentage,
                        },
                    },
                    senderUuid: empireTrackingUuid,
                };
                sendMessage(productionSettingsMessage);
            }
            catch (err) {
                _logError(err);
            }
        },
    });
}

function getLevelOrAmount(element: Element, id: number): number {
    const label = element.querySelector(`tr[class~="${id}"] .label`)?.textContent ?? _throw(`no label element found for techid ${id}`);
    const regex = /\b(?<level>\d+)\b/;

    const levelText = label.match(regex)?.groups?.level ?? _throw('no level text found');
    const level = parseIntSafe(levelText, 10);

    return level;
}

function getAllianceClass(element: Element): AllianceClass {
    const allianceClassElem = element.querySelector('.allianceclass') ?? _throw('no alliance class found');

    if (allianceClassElem.classList.contains('trader')) {
        return AllianceClass.trader;
    }
    if (allianceClassElem.classList.contains('explorer')) {
        return AllianceClass.researcher;
    }
    if (allianceClassElem.classList.contains('warrior')) {
        return AllianceClass.warrior;
    }

    return AllianceClass.none;
}

function getProductionPercentage(element: Element, techId: number): number {
    const select = element.querySelector(`select[name="productionFactor[${techId}]"]`) as HTMLSelectElement | null
        ?? _throw(`select not found for techid ${techId}`);

    const levelOrAmount = getLevelOrAmount(element, techId);
    // sometimes production is set to 0% for level/count 0 items, but will change to 100 automatically afterwards, so we just set it to 100
    if (levelOrAmount == 0)
        return 100;

    return parseIntSafe(select.value, 10);
}

