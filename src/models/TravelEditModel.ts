import { Travel } from '../schemas/Travel';
import { WaypointDataModel } from './WaypointDataModel';

type CreateArgs = {
  readonly id: string;
  readonly title: string;
  readonly waypoints: WaypointDataModel[];
  readonly startDate: Date;
  readonly endDate: Date;
  readonly isPublic: boolean;
};

export class TravelEditModel {
  readonly id: string;

  readonly title: string;

  readonly waypoints: WaypointDataModel[];

  readonly startDate: Date;

  readonly endDate: Date;

  readonly isPublic: boolean;

  constructor({
    id,
    waypoints,
    endDate,
    startDate,
    title,
    isPublic,
  }: CreateArgs) {
    this.id = id;
    this.title = title;
    this.waypoints = waypoints;
    this.startDate = startDate;
    this.endDate = endDate;
    this.isPublic = isPublic;
  }

  static createFromEntity(travel: Travel): TravelEditModel {
    return new this({
      id: travel._id.toString(),
      title: travel.title,
      waypoints: travel.waypoints,
      startDate: new Date(travel.dates.startDate),
      endDate: new Date(travel.dates.endDate),
      isPublic: travel.isPublic,
    });
  }
}
