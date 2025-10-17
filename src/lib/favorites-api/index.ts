export { addFavorite } from './api/addFavorite';
export { FavoritesKey } from './api/config';
export { removeFavorite } from './api/removeFavorite';
export {
  type FavoritesQueryResult,
  type FavoritesMutationArgs,
} from './api/types';

export { useFavoritesApi } from './hooks/useFavoritesApi';
export { useFavoritesMutations } from './hooks/useFavoritesMutations';
export { useFavoritesQuery } from './hooks/useFavoritesQuery';
export { useFetchFavorites } from './hooks/useFetchFavorites';
export { useKeyedFavoritesApi } from './hooks/useKeyedFavoritesApi';
export {
  type FavesMutationArgs,
  type FavoritesApiReturnType,
  type FavesMutationArgsWithExplicitKey,
  type FavesMutationArgsWithImplicitKey,
  type Favoritable,
  type UseFavoritesConfig,
  type UseFetchFavoritesOptions,
  type UseFetchFavoritesArgs,
} from './hooks/types';
