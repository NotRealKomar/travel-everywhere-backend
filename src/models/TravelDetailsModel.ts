import { DestinationModel } from '../models/DestinationModel';

type CreateArgs = {
  readonly id: string;
  readonly title: string;
  readonly destinations: DestinationModel[];
  readonly startDate: string;
  readonly endDate: string;
  readonly isPublic: boolean;
  readonly userId: string;
  readonly routeData: unknown;
};

export class TravelDetailsModel {
  readonly id: string;

  readonly title: string;

  readonly destinations: DestinationModel[];

  // formatted date
  readonly startDate: string;

  // formatted date
  readonly endDate: string;

  readonly isPublic: boolean;

  readonly userId: string;

  // TODO: GET RID OF UNKNOWN TYPES!!!
  readonly routeData: unknown;

  constructor({
    id,
    destinations,
    endDate,
    startDate,
    title,
    isPublic,
    userId,
    routeData,
  }: CreateArgs) {
    this.id = id;
    this.title = title;
    this.destinations = destinations;
    this.startDate = startDate;
    this.endDate = endDate;
    this.isPublic = isPublic;
    this.userId = userId;
    this.routeData = routeData;
  }
}
