import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { validate } from 'class-validator';
import { CountryCodeDto } from './dto/countryCode.dto';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  getAvailableCountries() {
    return this.countriesService.getAvailableCountries();
  }

  @Get(':countryCode')
  async getCountryInfo(@Param('countryCode') countryCode: string) {
    const dto = new CountryCodeDto();
    dto.countryCode = countryCode;
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException('Invalid country code');
    }
    return this.countriesService.getCountryInfo(countryCode);
  }
}
