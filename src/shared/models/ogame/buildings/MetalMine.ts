import { Cost } from "../common/Cost";
import { BuildingType } from "./BuildingType";
import { ProductionBuilding, ProductionBuildingDependencies } from "./ProductionBuilding";

class MetalMineClass extends ProductionBuilding {

    public get type() {
        return BuildingType.metalMine;
    }

    public getProduction(level: number, dependencies: ProductionBuildingDependencies): number {
        const boost = this.getProductionBoost(dependencies.planet.position);
        const baseProduction = 30 * dependencies.serverSettings.economySpeed * (1 + boost);
        const mineProduction = Math.trunc(baseProduction * level * 1.1 ** level * dependencies.productionSettings.metalMine / 100);
        
        return mineProduction;
    }


    private getProductionBoost(position: number) {
        switch (position) {
            case 8:
                return 0.35;

            case 7:
            case 9:
                return 0.23;

            case 6:
            case 10:
                return 0.17;
        }

        return 0;
    }

    public getConsumption(level: number, dependencies: ProductionBuildingDependencies): Cost {
        return {
            metal: 0,
            crystal: 0,
            deuterium: 0,
            energy: Math.ceil(10 * level * 1.1 ** level),
        };
    }

    public getCost(level: number): Cost {
        return {
            metal: Math.floor(40 * 1.5 ** level),
            crystal: Math.floor(10 * 1.5 ** level),
            deuterium: 0,
            energy: 0,
        };
    }

}
export const MetalMine = new MetalMineClass();