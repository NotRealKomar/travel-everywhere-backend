import { Injectable } from '@nestjs/common';
import { GeometryData, WaypointData } from '../../models/RouteModel';

const BOUNDARY_PRECISION = 1.3;

@Injectable()
export class BoundaryService {
  calculateBoundaries(
    data: GeometryData,
    waypoints: WaypointData[],
  ): number[][] {
    const coordinates = data.coordinates[0];

    let southWestPoint = coordinates[0];
    let northEastPoint = coordinates[0];

    const startX = waypoints.at(0).location[0];
    const finishX = waypoints.at(-1).location[0];

    const startY = waypoints.at(0).location[1];
    const finishY = waypoints.at(-1).location[1];

    // TODO: Optimize boundary calculation
    if (startY > finishY) {
      if (startX < finishX) {
        coordinates.forEach((point: number[]) => {
          if (point[0] >= southWestPoint[0] && point[1] <= southWestPoint[1]) {
            northEastPoint = point;
          }

          if (point[0] <= southWestPoint[0] && point[1] >= southWestPoint[1]) {
            southWestPoint = point;
          }
        });
      }

      if (startX > finishX) {
        coordinates.forEach((point: number[]) => {
          if (point[0] >= southWestPoint[0] && point[1] >= southWestPoint[1]) {
            northEastPoint = point;
          }

          if (point[0] <= southWestPoint[0] && point[1] <= southWestPoint[1]) {
            southWestPoint = point;
          }
        });
      }
    }

    if (startY < finishY) {
      if (startX < finishX) {
        coordinates.forEach((point: number[]) => {
          if (point[0] >= southWestPoint[0] && point[1] >= southWestPoint[1]) {
            northEastPoint = point;
          }

          if (point[0] <= southWestPoint[0] && point[1] <= southWestPoint[1]) {
            southWestPoint = point;
          }
        });
      }

      if (startX > finishX) {
        coordinates.forEach((point: number[]) => {
          if (point[0] >= southWestPoint[0] && point[1] <= southWestPoint[1]) {
            northEastPoint = point;
          }

          if (point[0] <= southWestPoint[0] && point[1] >= southWestPoint[1]) {
            southWestPoint = point;
          }
        });
      }
    }

    southWestPoint = southWestPoint.map(
      (point: number): number => point - BOUNDARY_PRECISION,
    );

    northEastPoint = northEastPoint.map(
      (point: number): number => point + BOUNDARY_PRECISION,
    );

    return [southWestPoint, northEastPoint];
  }
}
