import React, { createContext, useState } from 'react';

import { User } from '../types/User';

export const DummyAuthContext = createContext<{
  dummyUser: User;
  swapUsers: () => void;
}>(
  {} as {
    dummyUser: User;
    swapUsers: () => void;
  }
);

export function DummyAuthProvider({ children }: React.PropsWithChildren) {
  const [userIndex, setUserIndex] = useState<0 | 1>(0);

  return (
    <DummyAuthContext.Provider
      value={{
        dummyUser: DUMMY_USERS[userIndex],
        swapUsers: () => setUserIndex((i) => (i === 0 ? 1 : 0)),
      }}
    >
      {children}
    </DummyAuthContext.Provider>
  );
}

const DUMMY_USERS: User[] = [
  {
    id: 123,
    name: 'User A',
    email: 'foo.1@bar.baz',
    avatarUrl: undefined,
  },
  {
    id: 456,
    name: 'User B',
    email: 'foo.2@bar.baz',
    avatarUrl: undefined,
  },
];
