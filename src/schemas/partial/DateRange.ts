type CreateArgs = {
  readonly startDate: Date;
  readonly endDate: Date;
};

export class DateRange {
  readonly startDate: Date;

  readonly endDate: Date;

  constructor({ endDate, startDate }: CreateArgs) {
    this.startDate = startDate;
    this.endDate = endDate;
  }
}
