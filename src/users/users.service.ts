import { Injectable } from '@nestjs/common';
import { AddHolidaysDto } from './dto/add-holidays.dto';
import { CalendarService } from './calendar/calendar.service';

@Injectable()
export class UsersService {
  constructor(private readonly calendarService: CalendarService) {}

  async addHolidaysToCalendar(userId: string, dto: AddHolidaysDto) {
    return this.calendarService.addHolidays(userId, dto);
  }
}
