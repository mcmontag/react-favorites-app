import { useCallback, useContext } from 'react';

import { AppContext } from '../../../contexts/AppContext';

import { FavoritesKey } from '../api/config';
import { FavoritesQueryResult } from '../api/types';

import { UseFetchFavoritesOptions } from './types';
import { useFetchFavorites } from './useFetchFavorites';

const EMPTY_RESULT: FavoritesQueryResult = [];

export function useFavoritesQuery(
  { key }: { key?: FavoritesKey },
  options?: UseFetchFavoritesOptions
) {
  const { user } = useContext(AppContext);

  const { data, refetch, isLoading, ...rest } = useFetchFavorites(
    {
      userId: user.id,
      key,
    },
    options
  );

  const refetchWithVoidReturn = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return {
    favorites: data || EMPTY_RESULT,
    loading: isLoading,
    refetch: refetchWithVoidReturn,
    ...rest,
  };
}
