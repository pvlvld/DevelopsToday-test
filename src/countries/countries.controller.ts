import { Controller, Get, Param } from '@nestjs/common';
import { CountriesService } from './countries.service';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  getAvailableCountries() {
    return this.countriesService.getAvailableCountries();
  }

  @Get(':countryCode')
  getCountryInfo(@Param('countryCode') countryCode: string) {
    return this.countriesService.getCountryInfo(countryCode);
  }
}
