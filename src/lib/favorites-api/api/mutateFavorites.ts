import { buildFavesUri } from './buildUri';
import { FavoritesMutationArgs } from './types';

export async function mutateFavorites({
  key,
  value,
  op,
  userId,
  onSuccess,
}: FavoritesMutationArgs) {
  return fetch(buildFavesUri({ userId, key }), {
    method: 'POST',
    body: JSON.stringify({ op, value }),
    headers: [['Content-Type', 'application/json']],
  }).then(async (resp) => {
    if (resp.ok) return onSuccess?.();
  });
}
