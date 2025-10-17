import { useCallback, useMemo } from 'react';

import { FavoritesKey } from '../api/config';

import {
  FavoritesApiReturnType,
  FavesMutationArgsWithImplicitKey,
  UseFetchFavoritesOptions,
} from './types';
import { useFavoritesMutations } from './useFavoritesMutations';
import { useFavoritesQuery } from './useFavoritesQuery';

export function useKeyedFavoritesApi(
  favoritesKey: FavoritesKey,
  options?: UseFetchFavoritesOptions
): FavoritesApiReturnType<{ value: string }> {
  const {
    favorites: favoritesList,
    refetch,
    ...rest
  } = useFavoritesQuery({ key: favoritesKey }, options);

  const { addFavorite, removeFavorite } = useFavoritesMutations({
    onSuccess: refetch,
  });

  const addFavoriteCallback = useCallback(
    ({ value }: FavesMutationArgsWithImplicitKey) => {
      return addFavorite({ key: favoritesKey, value });
    },
    [addFavorite, favoritesKey]
  );

  const removeFavoriteCallback = useCallback(
    ({ value }: FavesMutationArgsWithImplicitKey) => {
      return removeFavorite({ key: favoritesKey, value });
    },
    [removeFavorite, favoritesKey]
  );

  const favorites = useMemo(() => {
    return favoritesList.reduce(
      (acc, favorite) => {
        acc[favorite.value] = true;
        return acc;
      },
      {} as Record<string, true>
    );
  }, [favoritesList]);

  return {
    favorites,
    addFavorite: addFavoriteCallback,
    removeFavorite: removeFavoriteCallback,
    refetch,
    ...rest,
  };
}
