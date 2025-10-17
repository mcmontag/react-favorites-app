import { SimpleUseQueryOptions } from '../../../types/util/SimpleUseQueryOptions';

import { FavoritesKey } from '../api/config';
import { FavoritesQueryResult } from '../api/types';

export type FavesMutationArgs =
  | FavesMutationArgsWithExplicitKey
  | FavesMutationArgsWithImplicitKey;

export type FavesMutationArgsWithExplicitKey = {
  key: FavoritesKey;
  value: string;
};
export type FavesMutationArgsWithImplicitKey = { value: string };

export type FavoritesApiReturnType<MutationArgs extends FavesMutationArgs> = {
  favorites: MutationArgs extends FavesMutationArgsWithExplicitKey
    ? Record<FavoritesKey, Record<string, true>>
    : Record<string, true>;
  loading: boolean;
  error: any;
  addFavorite: (args: MutationArgs) => void;
  removeFavorite: (args: MutationArgs) => void;
  refetch: () => Promise<void>;
};

export type Favoritable = Exclude<Record<string, any>, { isFavorited: any }>;

export type UseFavoritesConfig<T> = {
  key: FavoritesKey;
  getValue: (item: T) => string;
  sortFunc?: (a: T, b: T) => number;
};
export type UseFetchFavoritesArgs = {
  userId: number;
  key?: FavoritesKey;
};
export type UseFetchFavoritesOptions =
  SimpleUseQueryOptions<FavoritesQueryResult>;
