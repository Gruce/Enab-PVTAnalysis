export type POINT_TYPE = {
    p: number,
    v: number,
    t: number,
    slope?: number,
    compressibility?: number,
    relativeVolume?: number,
    yFunction?: number,
    oilDensity?: number,
    isBeforeSP?: boolean,
    predicatedVolume?: number,
}

export type SP_TYPE = {
    p: number,
    v: number,
    thermalExpansion?: number,
}

export type YFUNCTION_TYPE = {
    p: number,
    yFunction: number
}

export type CME_TYPE = {
    id: number;

    loading_temperature: number;
    loading_volume: number;

    temperature_setpoint: number;

    points: POINT_TYPE[];

    sp: SP_TYPE;

    oil_density: number;

    // Plots
    yFunction: YFUNCTION_TYPE[];
}