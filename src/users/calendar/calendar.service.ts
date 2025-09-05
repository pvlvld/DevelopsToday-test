import { Injectable } from '@nestjs/common';
import { AddHolidaysDto } from '../dto/add-holidays.dto';

@Injectable()
export class CalendarService {
  async addHolidays(userId: string, dto: AddHolidaysDto) {
    // feat: https://date.nager.at/api/v3/PublicHolidays/{year}/{countryCode}
    // filter if specific, save to DB
    return { userId, ...dto, saved: true };
  }
}
