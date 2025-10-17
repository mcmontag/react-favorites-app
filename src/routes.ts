import { route, string } from 'react-router-typesafe-routes';

export const routes = route({
  children: {
    home: route({
      path: 'home',
    }),
    countries: route({
      path: 'countries',
      searchParams: {
        code: string().array(),
      },
      state: {
        selected: string(),
      },
    }),
  },
});
