import { mutateFavorites } from './mutateFavorites';
import { FavoritesMutationArgs } from './types';

/**
 * Removes an item from favorites by delegating to the general mutateFavorites function.
 * This is a convenience wrapper around mutateFavorites with the 'REMOVE' operation.
 */
export async function removeFavorite(args: Omit<FavoritesMutationArgs, 'op'>) {
  return mutateFavorites({ ...args, op: 'REMOVE' });
}
