import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AddHolidaysDto } from '../dto/add-holidays.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Holiday } from 'generated/prisma';
import { Prisma } from 'generated/prisma';

type IHolidayAPIInfo = {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  fixed: boolean;
  global: boolean;
  counties: string[] | null;
  launchYear: number | null;
  types: string[];
};

@Injectable()
export class CalendarService {
  constructor(private prisma: PrismaService) {}

  async addHolidays(userId: number, dto: AddHolidaysDto) {
    const holidaysInfo = await fetch(
      `https://date.nager.at/api/v3/PublicHolidays/${dto.year}/${dto.countryCode}`,
    )
      .then((r) => r.json() as Promise<IHolidayAPIInfo[]>)
      .catch((error) => {
        console.error('Error fetching holidays:', error);
        throw new InternalServerErrorException(
          'Failed to fetch holidays from external API',
        );
      });

    if (!holidaysInfo || 'status' in holidaysInfo) {
      console.error('Error fetching holidays:', holidaysInfo);
      throw new InternalServerErrorException(
        'Failed to fetch holidays from external API',
      );
    }

    if (holidaysInfo.length === 0) {
      throw new NotFoundException(
        'No holidays found for the specified country and year',
      );
    }

    const data = [] as Prisma.HolidayCreateManyInput[];

    for (const holiday of holidaysInfo) {
      if (dto.holidays && !dto.holidays.includes(holiday.localName)) {
        continue;
      }

      data.push({
        name: holiday.name,
        date: new Date(holiday.date),
        localName: holiday.localName,
        isGlobal: holiday.global,
        countryCode: holiday.countryCode,
        userId,
      });
    }

    if (data.length === 0) {
      throw new NotFoundException(
        'No matching holidays found for the specified names',
      );
    }

    await this.prisma.holiday
      .createMany({ data, skipDuplicates: true })
      .catch((error) => {
        console.error('Error saving holidays to the database:', error);
        throw new InternalServerErrorException(
          'Failed to save holidays to the database',
        );
      });

    return { userId, ...data, saved: true };
  }
}
