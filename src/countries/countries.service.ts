import { Injectable, InternalServerErrorException } from '@nestjs/common';

type ICountryInfo = {
  commonName: string;
  officialName: string;
  countryCode: string;
  region: string;
  borders: ICountryInfo[];
};

type IPopulationCount = {
  year: number;
  value: number;
};

type ICountryPopulationData = {
  country: string;
  code: string;
  iso3: string;
  populationCounts: IPopulationCount[];
};

type ICountryFlagData = {
  name: string;
  flag: string;
  iso2: string;
  iso3: string;
};

type ICountryInfoResponse = {
  borders: {
    name: string;
  }[];
  population: IPopulationCount[];
  flag: string;
};
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

  async getCountryInfo(countryCode: string): Promise<ICountryInfoResponse> {
    countryCode = countryCode.toUpperCase();

    const [general, population, flag] = await Promise.all([
      fetch(`https://date.nager.at/api/v3/CountryInfo/${countryCode}`).then(
        (r) => r.json() as Promise<Partial<ICountryInfo>>,
      ),
      // API supports fetching single country but it's require country name not code
      fetch(
        `https://countriesnow.space/api/v0.1/countries/population`,
        {},
      ).then(
        (r) => r.json() as Promise<Partial<{ data: ICountryPopulationData[] }>>,
      ),
      fetch(`https://countriesnow.space/api/v0.1/countries/flag/images`).then(
        (r) => r.json() as Promise<Partial<{ data: ICountryFlagData[] }>>,
      ),
    ]);

    if (!general) {
      throw new InternalServerErrorException(
        'Failed to fetch country general info',
      );
    }

    if ('status' in general) {
      if (general.status == 404) {
        throw new InternalServerErrorException('Country not found');
      } else {
        throw new InternalServerErrorException(
          'Failed to fetch country general info',
        );
      }
    }

    const countryOfficialName = general?.officialName?.toUpperCase() || '';

    const countryInfo = this.generateCountryInfo(
      countryOfficialName,
      general,
      population?.data || [],
      flag?.data || [],
    );
    return countryInfo;
  }

  private generateCountryInfo(
    countryName: string,
    general: Partial<ICountryInfo>,
    population: ICountryPopulationData[],
    flag: ICountryFlagData[],
  ): ICountryInfoResponse {
    return {
      borders: general.borders?.map((b) => ({ name: b.officialName })) || [],
      population:
        population.find((c) => c.country === countryName)?.populationCounts ||
        [],
      flag: flag.find((c) => c.name === countryName)?.flag || '',
    };
  }
}
