import {
  IsString,
  IsArray,
  IsOptional,
  IsISO31661Alpha2,
  IsInt,
} from 'class-validator';

export class AddHolidaysDto {
  @IsISO31661Alpha2()
  @IsString()
  countryCode: string;

  @IsInt()
  year: number;

  @IsString({ each: true })
  @IsArray({})
  @IsOptional()
  holidays?: string[];
}
