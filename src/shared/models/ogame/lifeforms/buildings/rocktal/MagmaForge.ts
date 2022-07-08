import { Cost } from "../../../common/Cost";
import { ResourceProductionBonusLifeformBuilding } from "../interfaces";
import { LifeformBuilding } from "../LifeformBuilding";

class MagmaForgeClass extends LifeformBuilding implements ResourceProductionBonusLifeformBuilding {
    public constructor() {
        super({
            metal: {
                baseCost: 10_000,
                increaseFactor: 1.4,
            },
            crystal: {
                baseCost: 8_000,
                increaseFactor: 1.4,
            },
            deuterium: {
                baseCost: 1_000,
                increaseFactor: 1.4,
            },
            energy: {
                baseCost: 40,
                increaseFactor: 1.1
            },
        });
    }

    public getProductionBonus(level: number): Cost {
        const metalBonus = 0.02; // 2%

        return {
            metal: metalBonus * level,
            crystal: 0,
            deuterium: 0,
            energy: 0,
        };
    }
}

export const MagmaForge = new MagmaForgeClass();