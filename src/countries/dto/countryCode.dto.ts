import { IsISO31661Alpha2 } from 'class-validator';

export class CountryCodeDto {
  @IsISO31661Alpha2()
  countryCode: string;
}
