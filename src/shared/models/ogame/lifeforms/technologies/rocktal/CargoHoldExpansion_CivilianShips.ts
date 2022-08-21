import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { LifeformTechnology } from "../LifeformTechnology";

class CargoHoldExpansion_CivilianShipsClass extends LifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 20000,
                increaseFactor: 1.3,
            },
            crystal: {
                baseCost: 15000,
                increaseFactor: 1.3,
            },
            deuterium: {
                baseCost: 7500,
                increaseFactor: 1.3,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }

    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.cargoHoldExpansion_CivilianShips;
    }
}

export const CargoHoldExpansion_CivilianShips = new CargoHoldExpansion_CivilianShipsClass;
