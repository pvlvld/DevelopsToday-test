import { IsString, IsArray, IsOptional, IsNumber } from 'class-validator';

export class AddHolidaysDto {
  // TODO:
  // check API response
  // ISO 3166-1 alpha-2 country code? Validation?
  @IsString()
  countryCode: string;

  // Allowed range?
  @IsNumber()
  year: number;

  @IsString({ each: true })
  @IsArray({})
  @IsOptional()
  holidays?: string[];
}
