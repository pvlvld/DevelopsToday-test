import { Injectable } from '@nestjs/common';
import { AddHolidaysDto } from '../dto/add-holidays.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CalendarService {
  constructor(private prisma: PrismaService) {}

  async addHolidays(userId: string, dto: AddHolidaysDto) {
    // feat: https://date.nager.at/api/v3/PublicHolidays/{year}/{countryCode}
    // filter if specific, save to DB
    return { userId, ...dto, saved: true };
  }
}
