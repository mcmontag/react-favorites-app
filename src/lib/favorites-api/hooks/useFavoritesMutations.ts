import { useCallback, useContext, useMemo, useRef } from 'react';

import { AppContext } from '../../../contexts/AppContext';

import { addFavorite } from '../api/addFavorite';
import { FavoritesKey } from '../api/config';
import { removeFavorite } from '../api/removeFavorite';

export function useFavoritesMutations({
  onSuccess,
}: {
  onSuccess: () => Promise<void>;
}) {
  const {
    user: { id: userId },
  } = useContext(AppContext);

  // onSuccess is stabilized so that callers don't have to handle that themselves.
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const addFavoriteCallback = useCallback(
    async ({ key, value }: { key: FavoritesKey; value: string }) => {
      return addFavorite({
        key,
        value,
        userId,
        onSuccess: onSuccessRef.current,
      });
    },
    [userId]
  );

  const removeFavoriteCallback = useCallback(
    async ({ key, value }: { key: FavoritesKey; value: string }) => {
      return removeFavorite({
        key,
        value,
        userId,
        onSuccess: onSuccessRef.current,
      });
    },
    [userId]
  );

  return useMemo(
    () => ({
      addFavorite: addFavoriteCallback,
      removeFavorite: removeFavoriteCallback,
    }),
    [addFavoriteCallback, removeFavoriteCallback]
  );
}
