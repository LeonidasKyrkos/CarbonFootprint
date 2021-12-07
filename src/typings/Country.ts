export interface Country {
    name: string;
    years: {
        [key: string]: {
            carbon: number;
        };
    };
}

export interface BaseCountry {
    id: number;
    version: null;
    countryCode: string;
    countryName: string;
    shortName: string;
    isoa2: string;
    score: string;
}

export interface BaseCountryYear {
    builtupLand: number;
    carbon: number;
    countryCode: number;
    countryName: string;
    cropLand: number;
    fishingGround: number;
    forestLand: number;
    grazingLand: number;
    id: number;
    isoa2: string;
    record: string;
    score: string;
    shortName: string;
    value: number;
    version: null;
    year: number;
}
