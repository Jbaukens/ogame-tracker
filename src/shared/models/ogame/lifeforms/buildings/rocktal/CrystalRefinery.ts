import { Cost } from "../../../common/Cost";
import { ResourceType } from "../../../resources/ResourceType";
import { LifeformBonusType, LifeformBonusTypeId } from "../../LifeformBonusType";
import { LifeformBuildingType } from "../../LifeformBuildingType";
import { ResourceProductionBonusLifeformBuilding } from "../interfaces";
import { LifeformBuilding } from "../LifeformBuilding";

class CrystalRefineryClass extends LifeformBuilding implements ResourceProductionBonusLifeformBuilding {
    public constructor() {
        super({
            metal: {
                baseCost: 85_000,
                increaseFactor: 1.4,
            },
            crystal: {
                baseCost: 44_000,
                increaseFactor: 1.4,
            },
            deuterium: {
                baseCost: 25_000,
                increaseFactor: 1.4,
            },
            energy: {
                baseCost: 90,
                increaseFactor: 1.1,
            },
        });
    }

    public get bonuses(): LifeformBonusType[] {
        return [{ type: LifeformBonusTypeId.ResourceProductionBonus }];
    }
    
    public get type(): LifeformBuildingType {
        return LifeformBuildingType.crystalRefinery;
    }

    public appliesTo(resource: ResourceType): boolean {
        return [ResourceType.crystal].includes(resource);
    }

    public getProductionBonus(level: number): Cost {
        const crystalBonus = 0.02; // 2%

        return {
            metal: 0,
            crystal: crystalBonus * level,
            deuterium: 0,
            energy: 0,
        };
    }
}

export const CrystalRefinery = new CrystalRefineryClass();