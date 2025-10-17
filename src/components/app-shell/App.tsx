import {
  AppShell,
  Title,
  Group,
  LoadingOverlay,
  Box,
  UnstyledButton,
} from '@mantine/core';
import { Route, Routes } from 'react-router';

import { AppContext } from '../../contexts/AppContext';
import { useUserQuery } from '../../queries/useUserQuery';

import { AppNavLink } from './AppNavLink';
import { ROUTE_CONFIGS } from './routes/route-configs';
import { UserMenu } from './UserMenu';

/**
 * Main application component that provides the app shell layout and routing.
 * Uses Mantine's AppShell for consistent layout with header, navbar, and main content area.
 */
function App() {
  const { user, loading, error } = useUserQuery();

  if (loading || error || !user) {
    return (
      <Box pos="relative" h="100%" w="100%">
        <LoadingOverlay
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ type: 'bars' }}
          visible
        />
        <AppShell>
          <AppShell.Header p="md"></AppShell.Header>
          <AppShell.Navbar>
            <AppShell.Section grow></AppShell.Section>
            <AppShell.Section>
              <UnstyledButton></UnstyledButton>
            </AppShell.Section>
          </AppShell.Navbar>
          <AppShell.Main></AppShell.Main>
        </AppShell>
      </Box>
    );
  }

  return (
    <AppContext.Provider value={{ user }}>
      <AppShell
        header={{ height: '4rem' }}
        navbar={{ width: 250, breakpoint: 'sm' }}
        padding="md"
      >
        <AppShell.Header p="md">
          <Group>
            <Title order={3}>React Favorites App</Title>
          </Group>
        </AppShell.Header>

        <AppShell.Navbar p="md">
          <AppShell.Section grow>
            <AppNavLink route={ROUTE_CONFIGS.home} />
            <AppNavLink route={ROUTE_CONFIGS.countries} />
          </AppShell.Section>
          <AppShell.Section>
            <UserMenu />
          </AppShell.Section>
        </AppShell.Navbar>

        <AppShell.Main>
          <Routes>
            {Object.values(ROUTE_CONFIGS).map((route, i) => (
              <Route key={i} path={route.path} Component={route.Component} />
            ))}
          </Routes>
        </AppShell.Main>
      </AppShell>
    </AppContext.Provider>
  );
}

export default App;
