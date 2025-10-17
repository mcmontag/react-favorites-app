import { useMemo } from 'react';
import { Group, Loader, Stack } from '@mantine/core';
import { useTypedSearchParams } from 'react-router-typesafe-routes';

import { FavoritesKey } from '../../../lib/favorites-api';
import { useFavorites } from '../../../lib/favorites-api/hooks/useFavorites';
import { useCountriesQuery } from '../../../queries/useCountriesQuery';
import { routes } from '../../../routes';
import { CompactCountry } from '../../../types/Country';

import { CountryCard } from './CountryCard';

/**
 * Configuration for the favorites system specific to countries
 */
const USE_FAVORITES_CONFIG = {
  key: FavoritesKey.COUNTRIES,
  getValue: (c: CompactCountry) => c.code,
  sortFunc: (a: CompactCountry, b: CompactCountry) =>
    a.name.localeCompare(b.name),
};

/**
 * Countries page that displays a list of countries with favorites functionality.
 * Supports filtering by country code via URL search parameters.
 */
export function CountriesPage() {
  const [searchParams] = useTypedSearchParams(routes.countries);

  const { countries, loading: countriesLoading } = useCountriesQuery();

  const {
    items: countriesWithFavorites,
    addFavorite,
    removeFavorite,
    loading: favoritesLoading,
  } = useFavorites(countries, USE_FAVORITES_CONFIG);

  const processedCountries = useMemo(() => {
    return countriesWithFavorites.filter((c) => {
      let match = true;

      if (
        match &&
        searchParams.code.length > 0 &&
        !searchParams.code.some((code) => c.code.startsWith(code))
      ) {
        match = false;
      }

      return match;
    });
  }, [countriesWithFavorites, searchParams]);

  if (countriesLoading || favoritesLoading) {
    return <Loader />;
  }

  return (
    <Group>
      <Stack>
        {processedCountries.map((c) => {
          return (
            <CountryCard
              key={c.code}
              country={c}
              favorited={c.favorited}
              favorite={async () => addFavorite({ value: c.code })}
              unfavorite={async () => removeFavorite({ value: c.code })}
            />
          );
        })}
      </Stack>
    </Group>
  );
}
