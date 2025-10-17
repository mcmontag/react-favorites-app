import { forwardRef, useContext } from 'react';
import {
  UnstyledButtonProps,
  UnstyledButton,
  Group,
  Avatar,
  Text,
} from '@mantine/core';

import { AppContext } from '../../contexts/AppContext';
import { User } from '../../types/User';

export type UserButtonProps = { user: User } & UnstyledButtonProps;

export const UserButton = forwardRef<HTMLButtonElement, UnstyledButtonProps>(
  function UserButton({ ...props }, ref) {
    const { user } = useContext(AppContext);

    return (
      <UnstyledButton ref={ref} style={{ width: '100%' }} {...props}>
        <Group>
          <Avatar src={user.avatarUrl} name={user.name} />
          <div style={{ flex: 1 }}>
            <Text size="sm" fw={500}>
              {user.name}
            </Text>

            <Text c="dimmed" size="xs">
              {user.email}
            </Text>
          </div>
        </Group>
      </UnstyledButton>
    );
  }
);
