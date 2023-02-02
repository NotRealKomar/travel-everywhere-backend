import { UseGuards, Controller, Post, Body } from '@nestjs/common';
import { TravelToCalendarService } from '../services/travel/TravelToCalendarService';
import { CalendarEventModel } from '../models/CalendarEventModel';
import { JwtWithBodyAuthGuard } from '../guards/JwtWithBodyAuthGuard';
import { UserData } from '../dto/UserData';

@Controller('/app/calendar')
export class CalendarController {
  constructor(
    private readonly travelToCalendarService: TravelToCalendarService,
  ) {}

  @UseGuards(JwtWithBodyAuthGuard)
  @Post('/data')
  async getCalendarData(
    @Body() body: UserData | undefined,
  ): Promise<CalendarEventModel[]> {
    if (body === undefined || body.userId === undefined) {
      throw new Error('userId cannot be undefined');
    }

    return this.travelToCalendarService.getTravelsAsCalendar(body.userId);
  }
}
