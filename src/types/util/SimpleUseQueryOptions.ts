import { QueryKey, UseQueryOptions } from 'react-query';

export type SimpleUseQueryOptions<T> = Omit<
  UseQueryOptions<T, unknown, T, QueryKey>,
  'queryKey' | 'queryFn'
>;
