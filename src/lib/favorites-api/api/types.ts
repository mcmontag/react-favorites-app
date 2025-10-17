import { FavoritesKey } from './config';

export type FavoritesMutationArgs = {
  key: FavoritesKey;
  value: string;
  op: 'ADD' | 'REMOVE';
  userId: number;
  onSuccess?: () => Promise<void>;
};

export type FavoritesQueryResult = { key: FavoritesKey; value: string }[];
