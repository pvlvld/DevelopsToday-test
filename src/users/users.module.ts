import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CalendarService } from './calendar/calendar.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, CalendarService],
})
export class UsersModule {}
