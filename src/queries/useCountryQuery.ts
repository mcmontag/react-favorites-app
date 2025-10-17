import { useCallback, useMemo } from 'react';
import {
  gql,
  LazyQueryHookExecOptions,
  QueryHookOptions,
  useLazyQuery,
  useQuery,
} from '@apollo/client';

import { Language } from '../types/Language';

const COUNTRY_QUERY = gql`
  query ($code: ID!) {
    country(code: $code) {
      code
      name
      emoji
      awsRegion
      languages {
        code
        name
      }
    }
  }
`;

type LazyQueryArgsWithoutVariables<TData> = Omit<
  LazyQueryHookExecOptions<TData, any>,
  'variables'
>;

type QueryArgsWithoutVariables<TData> = Omit<
  QueryHookOptions<TData, any>,
  'variables'
>;

type CountryQueryResult = {
  country?: {
    code: string;
    name: string;
    emoji: string;
    awsRegion: string;
    languages: Language[];
  };
};

export function useCountryQuery(
  code: string,
  options: QueryArgsWithoutVariables<CountryQueryResult> = {}
) {
  const { data, ...rest } = useQuery<CountryQueryResult>(COUNTRY_QUERY, {
    variables: { code },
    ...options,
  });

  return {
    country: data?.country,
    ...rest,
  };
}

useCountryQuery.lazy = () => {
  const [exec, state] = useLazyQuery<CountryQueryResult>(COUNTRY_QUERY);

  const wrappedExec = useCallback(
    async (
      code: string,
      options: LazyQueryArgsWithoutVariables<CountryQueryResult> = {}
    ) => {
      return exec({ variables: { code }, ...options });
    },
    [exec]
  );

  return useMemo(() => {
    const { data, ...rest } = state;

    return [wrappedExec, { country: data?.country, ...rest }] as const;
  }, [wrappedExec, state]);
};
