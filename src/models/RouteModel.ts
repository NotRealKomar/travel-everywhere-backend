type RouteResponseData = {
  readonly features: RouteModel[];
};

export type WaypointData = {
  readonly location: number[];
  readonly original_index: number;
};

type InstructionData = {
  readonly text: string;
};

type WaypointLegsData = {
  readonly distance: number;
  readonly time: number;
  readonly steps: WaypointStepsData[];
};

type WaypointStepsData = {
  readonly from_index: number;
  readonly to_index: number;
  readonly distance: number;
  readonly time: number;
  readonly instruction: InstructionData;
};

type PropertiesData = {
  readonly mode: string;
  readonly waypoints: WaypointData[];
  readonly units: string;
  readonly distance: number;
  readonly distance_units: string;
  readonly time: number;
  readonly legs: WaypointLegsData[];
  readonly toll: boolean;
};

export type GeometryData = {
  readonly type: string;
  readonly coordinates: number[][][]; // wth
};

type CreateArgs = {
  readonly type: string;
  readonly properties: PropertiesData;
  readonly geometry: GeometryData;
};

export class RouteModel {
  readonly type: string;
  readonly properties: PropertiesData;
  readonly geometry: GeometryData;

  boundary: number[][];

  constructor(args: CreateArgs) {
    this.type = args.type;
    this.properties = args.properties;
    this.geometry = args.geometry;
  }

  static createFromResponse(response: RouteResponseData) {
    return new RouteModel(response.features.pop());
  }
}
