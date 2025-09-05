import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class CountriesService {
  async getAvailableCountries() {
    try {
      return await fetch(
        `https://date.nager.at/api/v3/AvailableCountries`,
      ).then((r) => r.json());
    } catch (error) {
      console.error('Error fetching available countries:', error);
      throw new InternalServerErrorException(
        'Failed to fetch available countries',
      );
    }
  }

  getCountryInfo(countryCode: string) {
    return {};
  }
}
