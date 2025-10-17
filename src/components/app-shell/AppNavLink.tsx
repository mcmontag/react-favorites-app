import { NavLink } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router';

import { RouteConfig, RouteKey } from './routes/route-configs';

export function AppNavLink({ route }: { route: RouteConfig<RouteKey> }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <NavLink
      label={route.label}
      leftSection={<route.Icon size="1rem" />}
      active={location.pathname === route.path}
      onClick={() => navigate(route.path)}
    />
  );
}
