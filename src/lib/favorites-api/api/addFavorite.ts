import { mutateFavorites } from './mutateFavorites';
import { FavoritesMutationArgs } from './types';

/**
 * Adds an item to favorites by delegating to the general mutateFavorites function.
 * This is a convenience wrapper around mutateFavorites with the 'ADD' operation.
 */
export async function addFavorite(args: Omit<FavoritesMutationArgs, 'op'>) {
  return mutateFavorites({ ...args, op: 'ADD' });
}
