import { useQuery } from 'react-query';

import { buildFavesUri } from '../api/buildUri';
import { FavoritesQueryResult } from '../api/types';

import { UseFetchFavoritesArgs, UseFetchFavoritesOptions } from './types';

export function useFetchFavorites(
  { userId, key }: UseFetchFavoritesArgs,
  options?: UseFetchFavoritesOptions
) {
  return useQuery<FavoritesQueryResult>(
    [userId, key],
    async () => {
      if (!userId || !key) {
        console.log({ userId, key });
        return [];
      }

      return (await fetch(buildFavesUri({ userId, key }))).json();
    },
    options
  );
}
