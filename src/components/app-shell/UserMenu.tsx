import { useContext } from 'react';
import { Menu } from '@mantine/core';

import { DummyAuthContext } from '../../contexts/DummyAuthProvider';

import { ThemePicker } from './ThemePicker';
import { UserButton } from './UserButton';

export function UserMenu() {
  const { swapUsers } = useContext(DummyAuthContext);

  return (
    <Menu position="top-end" closeOnItemClick={false}>
      <Menu.Target>
        <UserButton />
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item leftSection="Theme">
          <ThemePicker />
        </Menu.Item>
        <Menu.Item onClick={swapUsers}>Swap users</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
