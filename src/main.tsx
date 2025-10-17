import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { QueryCache, QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router';

import { DummyAuthProvider } from './contexts/DummyAuthProvider';
import App from './components/app-shell/App';

/**
 * Apollo Client instance configured for the Countries GraphQL API
 */
const apolloClient = new ApolloClient({
  uri: 'https://countries.trevorblades.com',
  cache: new InMemoryCache(),
});

/**
 * React Query client for managing server state and caching
 */
const reactQueryClient = new QueryClient({
  queryCache: new QueryCache(),
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <QueryClientProvider client={reactQueryClient}>
        <MantineProvider defaultColorScheme="auto">
          <BrowserRouter>
            <DummyAuthProvider>
              <App />
            </DummyAuthProvider>
          </BrowserRouter>
        </MantineProvider>
      </QueryClientProvider>
    </ApolloProvider>
  </React.StrictMode>
);
