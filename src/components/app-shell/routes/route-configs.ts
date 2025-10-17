import { Icon, IconGlobe, IconHome } from '@tabler/icons-react';
import { Route } from 'react-router-typesafe-routes';

import { routes } from '../../../routes';
import { WithPrefix } from '../../../types/util/WithPrefix';

import { CountriesPage } from '../../pages/countries/CountriesPage';
import { HomePage } from '../../pages/home/HomePage';

export const ROUTE_CONFIGS: { [p in RouteKey]: RouteConfig<p> } = {
  home: extendRoute(routes.home, {
    label: 'Home',
    Icon: IconHome,
    Component: HomePage,
  }),
  countries: extendRoute(routes.countries, {
    label: 'Countries',
    Icon: IconGlobe,
    Component: CountriesPage,
  }),
};

function extendRoute<R extends RouteKey>(
  route: ConcreteRoute<R>,
  config: Omit<RouteConfig<R>, 'path' | 'route'>
): RouteConfig<R> {
  return {
    ...config,
    path: route.$path() as RoutePath<R>,
    route: route,
  };
}

export type RouteKey = Exclude<keyof typeof routes, WithPrefix<'$'>>;
export type ConcreteRoute<R extends RouteKey> = (typeof routes)[R];

export type RouteConfig<P extends RouteKey> = {
  label: string;
  Icon: Icon;
  path: RoutePath<P>;
  Component: React.ComponentType;
  route: ConcreteRoute<P>;
};

export type RoutePath<R extends RouteKey> = ReturnType<
  Extract<ConcreteRoute<R>, Route>['$path']
>;
