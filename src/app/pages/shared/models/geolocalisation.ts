export interface CityDetails {
    type: string;
    geometry: Geometry;
    properties: Properties;
}

export interface Geometry {
    type: string;
    coordinates: [number, number];
}

export interface Properties {
    label: string;
    score: number;
    id: string;
    banId: string;
    type: string;
    name: string;
    postcode: string;
    citycode: string;
    x: number;
    y: number;
    population: number;
    city: string;
    context: string;
    importance: number;
    municipality: string;
    _type: string;
}
