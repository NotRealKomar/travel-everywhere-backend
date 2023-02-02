type CreateArgs = {
  readonly id: string;
  readonly title: string;
  readonly destinations: string[];
  readonly startDate: string;
  readonly endDate: string;
  readonly isPublic: boolean;
  readonly userId: string;
};

export class TravelModel {
  readonly id: string;

  readonly title: string;

  readonly destinations: string[];

  // formatted date
  readonly startDate: string;

  // formatted date
  readonly endDate: string;

  readonly isPublic: boolean;

  readonly userId: string;

  constructor({
    id,
    destinations,
    endDate,
    startDate,
    title,
    isPublic,
    userId,
  }: CreateArgs) {
    this.id = id;
    this.title = title;
    this.destinations = destinations;
    this.startDate = startDate;
    this.endDate = endDate;
    this.isPublic = isPublic;
    this.userId = userId;
  }
}
