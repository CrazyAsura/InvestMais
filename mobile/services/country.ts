import axios from 'axios';

export interface CountryData {
  name: string;
  cca2: string;
  idd: {
    root?: string;
    suffixes?: string[];
  };
  flag: string;
}

const countriesClient = axios.create({
  baseURL: 'https://restcountries.com/v3.1/',
});

export const getCountries = async (): Promise<CountryData[]> => {
  try {
    const { data } = await countriesClient.get('all?fields=name,cca2,idd,flags,flag');
    return data.map((c: any) => ({
      name: c.name.common,
      cca2: c.cca2,
      idd: c.idd,
      flag: c.flag || '', // Use the emoji flag
    })).sort((a: CountryData, b: CountryData) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
};
