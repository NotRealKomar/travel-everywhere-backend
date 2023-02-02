import { Injectable } from '@nestjs/common';
import { DateRange } from '../../schemas/partial/DateRange';
import { CalendarEventModel } from '../../models/CalendarEventModel';
import { TravelService } from './TravelService';
import { UserService } from '../../services/user/UserService';
import { format } from 'date-fns';

const DATE_FORMAT = 'dd/MM';

@Injectable()
export class TravelToCalendarService {
  constructor(
    private readonly travelService: TravelService,
    private readonly userService: UserService,
  ) {}

  async getTravelsAsCalendar(userId: string): Promise<CalendarEventModel[]> {
    const travels = await this.travelService.findManyByUser(userId);

    return travels.map(
      ({ title, dates }) =>
        new CalendarEventModel(
          this.generateTitle(title, dates),
          dates.startDate,
          dates.endDate,
        ),
    );
  }

  private generateTitle(title: string, dateRange: DateRange): string {
    const dates = `${format(dateRange.startDate, DATE_FORMAT)} — ${format(
      dateRange.endDate,
      DATE_FORMAT,
    )}`;

    return `${title.toLocaleUpperCase()} | ${dates}`;
  }
}
