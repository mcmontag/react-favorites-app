import { Country } from './Country';

export type Language = {
  code: string;
  name: string;
  countries: Pick<Country, 'code'>[];
};
