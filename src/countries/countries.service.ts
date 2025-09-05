import { Injectable } from '@nestjs/common';

@Injectable()
export class CountriesService {
  getAvailableCountries() {
    return [];
  }

  getCountryInfo(countryCode: string) {
    return {};
  }
}
