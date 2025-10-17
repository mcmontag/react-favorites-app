import { useContext } from 'react';
import { useQuery } from 'react-query';

import { DummyAuthContext } from '../contexts/DummyAuthProvider';
import { User } from '../types/User';

export function useUserQuery() {
  const { dummyUser } = useContext(DummyAuthContext);

  const { data, isLoading, error, refetch } = useQuery(
    [dummyUser],
    async () => {
      return await new Promise<{ user: User }>((resolve) =>
        setTimeout(() => resolve({ user: dummyUser }), 1000)
      );
    },
    { staleTime: 0 }
  );

  return {
    user: data?.user,
    loading: isLoading,
    error,
    refetch,
  };
}
