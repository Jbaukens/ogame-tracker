export interface RawMessageData {
    id: number;
    date: number;
    text: string;
    html: string;
    attributes: { [key: string]: string }; 
}

export interface RawDebrisFieldMessageData {
    id: number;
    date: number;
    coords: string;
    resources: {
        metal: number;
        crystal: number;
        deuterium: number;
    };
}

export interface RawLifeformDiscoveryMessageData {
    id: number;
    date: number;
    discoveryType: string;
    alreadyFound?: boolean;
    artifactsFound?: number;
    artifactsSize?: string;
    lifeform?: string
    lifeformExp?: number;
}