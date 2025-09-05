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
    // https://date.nager.at/api/v3/CountryInfo/UA
    // https://countriesnow.space/api/v0.1/countries/population
    // https://countriesnow.space/api/v0.1/countries/flag/images
    return this.countriesService.getCountryInfo(countryCode);
  }
}
