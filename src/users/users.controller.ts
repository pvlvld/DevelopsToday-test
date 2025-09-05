import {
  Controller,
  Post,
  Param,
  Body,
  ParseIntPipe,
  Get,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AddHolidaysDto } from './dto/add-holidays.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post(':userId/calendar/holidays')
  async addHolidaysToCalendar(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() addHolidaysDto: AddHolidaysDto,
  ) {
    return this.usersService.addHolidaysToCalendar(userId, addHolidaysDto);
  }

  @Get(':userId/calendar/holidays')
  async getHolidaysFromCalendar(@Param('userId', ParseIntPipe) userId: number) {
    return this.usersService.getHolidaysFromCalendar(userId);
  }
}
