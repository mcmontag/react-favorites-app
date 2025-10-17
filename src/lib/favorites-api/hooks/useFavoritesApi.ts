import { useMemo } from 'react';

import { FavoritesKey } from '../api/config';

import {
  FavoritesApiReturnType,
  FavesMutationArgsWithExplicitKey,
} from './types';
import { useFavoritesMutations } from './useFavoritesMutations';
import { useFavoritesQuery } from './useFavoritesQuery';

export function useFavoritesApi(): FavoritesApiReturnType<FavesMutationArgsWithExplicitKey> {
  const {
    favorites: favoritesList,
    refetch,
    ...rest
  } = useFavoritesQuery({ key: undefined });

  const { addFavorite, removeFavorite } = useFavoritesMutations({
    onSuccess: refetch,
  });

  const favorites = useMemo(() => {
    return favoritesList.reduce(
      (acc, { key, value }) => {
        if (acc[key]) acc[key][value] = true;
        else acc[key] = { [value]: true };
        return acc;
      },
      {} as Record<FavoritesKey, Record<string, true>>
    );
  }, [favoritesList]);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    refetch,
    ...rest,
  };
}
