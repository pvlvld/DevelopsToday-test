import { Injectable, NotFoundException } from '@nestjs/common';
import { AddHolidaysDto } from './dto/add-holidays.dto';
import { CalendarService } from './calendar/calendar.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly calendarService: CalendarService,
  ) {}

  async getUserById(userId: number) {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  async addHolidaysToCalendar(userId: number, dto: AddHolidaysDto) {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.calendarService.addHolidays(userId, dto);
  }

  async getHolidaysFromCalendar(userId: number) {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.prisma.holiday.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
    });
  }
}
