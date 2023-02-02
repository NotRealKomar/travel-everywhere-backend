import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { RouteModel } from '../../models/RouteModel';
import { BoundaryService } from '../geodata/BoundaryService';
import { PlacesUrlService, PlacesUrlType } from '../PlacesUrlService';

export type WaypointType = {
  lat: string;
  lon: string;
};

type GetRoutingArgs = {
  waypoints: WaypointType[];
  mode: 'drive'; // TODO: Add support for 'walk' mode
};

@Injectable()
export class RouteService {
  constructor(
    private readonly placesUrlService: PlacesUrlService,
    private readonly boundaryService: BoundaryService,
  ) {}

  async getRouting(args: GetRoutingArgs): Promise<RouteModel> {
    const url = this.placesUrlService.getPlacesUrl(PlacesUrlType.ROUTING);

    url.searchParams.append(
      'waypoints',
      this.transformWaypoints(args.waypoints),
    );
    url.searchParams.append('mode', args.mode);

    const response = await axios.get(url.toString());
    const model = RouteModel.createFromResponse(response.data);

    model.boundary = this.boundaryService.calculateBoundaries(
      model.geometry,
      model.properties.waypoints,
    );

    return model;
  }

  private transformWaypoints(waypoints: WaypointType[]): string {
    return waypoints
      .map(
        (waypoint: WaypointType): string => `${waypoint.lat},${waypoint.lon}`,
      )
      .join('|');
  }
}
