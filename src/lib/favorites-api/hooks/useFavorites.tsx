import { useMemo, useRef } from 'react';

import { useKeyedFavoritesApi } from './useKeyedFavoritesApi';
import {
  FavesMutationArgsWithImplicitKey,
  Favoritable,
  FavoritesApiReturnType,
  UseFavoritesConfig,
} from './types';

/**
 * Hook to manage favorites for a collection of items.
 * Decorates items with favorited status and provides add/remove functionality.
 * Items are automatically sorted with favorites appearing first.
 */
export function useFavorites<T extends Favoritable>(
  items: T[],
  { key, getValue, sortFunc }: UseFavoritesConfig<T>
): { items: (T & { favorited: boolean })[] } & Omit<
  FavoritesApiReturnType<FavesMutationArgsWithImplicitKey>,
  'favorites'
> {
  const stableGetValue = useRef(getValue);
  stableGetValue.current = getValue;

  const stableSortFunc = useRef(sortFunc);
  stableSortFunc.current = sortFunc;

  const skipQuery = items.length === 0;

  const { favorites, ...rest } = useKeyedFavoritesApi(key, {
    enabled: !skipQuery,
  });

  const decorated = useMemo(() => {
    return items
      .map((item) => ({
        favorited: !!favorites[stableGetValue.current(item)],
        ...item,
      }))
      .sort((a, b) => {
        if (a.favorited === b.favorited) {
          return stableSortFunc.current?.(a, b) || 0;
        }

        return a.favorited ? -1 : 1;
      });
  }, [items, favorites]);

  return {
    items: decorated,
    ...rest,
  };
}
