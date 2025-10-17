import { FavoritesKey } from './config';

const BASE_URI = 'http://localhost:3000/api';

export function buildFavesUri({
  userId,
  key,
}: {
  userId: number;
  key?: FavoritesKey;
}) {
  return `${BASE_URI}/users/${userId}/faves${key ? `/${key}` : ''}`;
}
