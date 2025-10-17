import '@testing-library/jest-dom';
import * as React from 'react';

// Add TextEncoder/TextDecoder for jsdom environment
global.TextEncoder = global.TextEncoder || require('util').TextEncoder;
global.TextDecoder = global.TextDecoder || require('util').TextDecoder;

// Mock React for JSX support in tests
global.React = React;

jest.mock('./routes', () => {
  return {
    routes: {
      home: { $path: () => 'home' },
      countries: { $path: () => 'home' },
    },
  };
});

jest.mock('@apollo/client', () => {
  return {
    gql: jest.fn(),
    useQuery: jest.fn(),
    useLazyQuery: jest.fn(),
  };
});
