import { gql } from '@apollo/client';
import { QueryHookOptions, useQuery } from '@apollo/client';

import { CompactCountry } from '../types/Country';

/**
 * GraphQL query to fetch basic country information.
 * TODO - support codegen for GQL result types, and put them all in one place.
 */
const COUNTRIES_QUERY = gql`
  query {
    countries {
      code
      name
      emoji
    }
  }
`;

/**
 * Type definition for the GraphQL query result
 */
type CountriesQueryResult = {
  countries: CompactCountry[];
};

/**
 * Empty array fallback for countries data (used while loading or on error).
 * This prevents callers from needing to worry about null safety.
 */
const EMPTY_COUNTRIES_RESULT: CompactCountry[] = [];

/**
 * Hook to fetch countries data from the GraphQL API.
 * Returns countries array with loading and error states.
 */
export function useCountriesQuery(options: QueryHookOptions = {}) {
  const { data, ...rest } = useQuery<CountriesQueryResult>(
    COUNTRIES_QUERY,
    options
  );

  return {
    countries: data?.countries ?? EMPTY_COUNTRIES_RESULT,
    ...rest,
  };
}
