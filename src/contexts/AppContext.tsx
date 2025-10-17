import React from 'react';

import { User } from '../types/User';

export const AppContext = React.createContext<{
  user: User;
}>(
  {} as {
    user: User;
  }
);
