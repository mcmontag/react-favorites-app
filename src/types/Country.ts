import { Language } from './Language';

export type CompactCountry = {
  code: string;
  name: string;
  emoji: string;
};

export type Country = CompactCountry & {
  awsRegion: string;
  languages: Language[];
};
