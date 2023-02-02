export class CalendarEventModel {
  readonly title: string;

  readonly startDate: Date;

  readonly endDate: Date;

  constructor(title: string, startDate: Date, endDate: Date) {
    this.title = title;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}
