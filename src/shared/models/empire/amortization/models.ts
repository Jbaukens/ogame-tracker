import { BuildingType } from "@/shared/models/ogame/buildings/BuildingType";
import { Cost } from "@/shared/models/ogame/common/Cost";
import { LifeformBuildingType } from "@/shared/models/ogame/lifeforms/LifeformBuildingType";
import { LifeformTechnologyType } from "@/shared/models/ogame/lifeforms/LifeformTechnologyType";
import { EmpireProductionPlanetState } from "@/shared/models/ogame/resource-production/types";
import { ResourceType } from "@/shared/models/ogame/resources/ResourceType";
import { AmortizationExpeditionResultsPlanetState } from "./AmortizationExpeditionResultsBreakdown";
import { AmortizationPlanetState } from "./AmortizationItemGenerator";

export type MineBuildingType = BuildingType.metalMine | BuildingType.crystalMine | BuildingType.deuteriumSynthesizer;

export interface LifeformBuildingLevels {
    planetId: number;
    building: LifeformBuildingType;
    levels: { from: number; to: number };
}

export interface LifeformTechnologyLevels {
    planetId: number;
    technology: LifeformTechnologyType;
    levels: { from: number; to: number };
}


export interface BaseAmortizationItem {
    cost: Cost;
    costConverted: number;
    productionDelta: Cost;
    productionDeltaConverted: number;
    timeInHours: number;
}

export interface MineAmortizationItem extends BaseAmortizationItem {
    type: 'mine';
    planetId: number;
    mine: MineBuildingType;
    level: number;
    additionalLifeformBuildings: LifeformBuildingLevels[];
}

export interface PlasmaTechnologyAmortizationItem extends BaseAmortizationItem {
    type: 'plasma-technology';
    level: number;
    additionalLifeformStuff: (LifeformTechnologyLevels | LifeformBuildingLevels)[];
}

export interface AstrophysicsAmortizationLevels {
    mines: Record<MineBuildingType, number>;
    lifeformBuildings: Record<LifeformBuildingType, number>;
    lifeformTechnologies: Record<LifeformTechnologyType, number>;
}
export interface AstrophysicsAmortizationItem extends BaseAmortizationItem {
    type: 'astrophysics-and-colony';
    levels: number[];
    newPlanetId: number;

    builtLevels: AstrophysicsAmortizationLevels;

    planetState: AmortizationPlanetState;
    planetExpeditionState: AmortizationExpeditionResultsPlanetState;
    newPlanetProductionStates: Record<ResourceType, EmpireProductionPlanetState>;
}

export interface LifeformBuildingAmortizationItem extends BaseAmortizationItem {
    type: 'lifeform-building';
    planetId: number;
    building: LifeformBuildingType;
    level: number;
    additionalLifeformBuildings: LifeformBuildingLevels[];
}

export interface LifeformTechnologyAmortizationItem extends BaseAmortizationItem {
    type: 'lifeform-technology';
    planetId: number;
    technology: LifeformTechnologyType;
    level: number;
    additionalLifeformBuildings: LifeformBuildingLevels[];
}

export type AmortizationItem =
    | MineAmortizationItem
    | PlasmaTechnologyAmortizationItem
    | AstrophysicsAmortizationItem
    | LifeformBuildingAmortizationItem
    | LifeformTechnologyAmortizationItem;
