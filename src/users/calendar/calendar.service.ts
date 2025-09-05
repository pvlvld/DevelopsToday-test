import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AddHolidaysDto } from '../dto/add-holidays.dto';
import { PrismaService } from 'src/prisma/prisma.service';
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
    const holidaysInfo = await this.fetchHolidaysFromAPI(
      dto.countryCode,
      dto.year,
    ).catch((error) => {
      console.error('Error fetching holidays from API:', error);
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

    const data = this.mapAPIResponseToHolidays(userId, holidaysInfo);

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

  private async fetchHolidaysFromAPI(countryCode: string, year: number) {
    const response = await fetch(
      `https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`,
    );
    if (!response.ok) {
      throw new InternalServerErrorException(
        'Failed to fetch holidays from external API',
      );
    }
    return (await response.json()) as IHolidayAPIInfo[];
  }

  private mapAPIResponseToHolidays(
    userId: number,
    apiResponse: IHolidayAPIInfo[],
  ): Prisma.HolidayCreateManyInput[] {
    return apiResponse.map((holiday) => ({
      name: holiday.name,
      date: new Date(holiday.date),
      localName: holiday.localName,
      isGlobal: holiday.global,
      countryCode: holiday.countryCode,
      userId,
    }));
  }
}
