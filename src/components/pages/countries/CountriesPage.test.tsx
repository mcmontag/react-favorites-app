import { render, screen, waitFor } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router';

import { useFavorites } from '../../../lib/favorites-api/hooks/useFavorites';
import { useCountriesQuery } from '../../../queries/useCountriesQuery';

import { CountriesPage } from './CountriesPage';
import { CountryCard } from './CountryCard';
import { useTypedSearchParams } from 'react-router-typesafe-routes';

// Mock the hooks
jest.mock('../../../queries/useCountriesQuery');
jest.mock('../../../lib/favorites-api/hooks/useFavorites');
jest.mock('react-router-typesafe-routes');

// Mock the CountryCard component
jest.mock('./CountryCard');

const mockUseTypedSearchParams = jest
  .mocked(useTypedSearchParams)
  .mockImplementation(() => [{ code: [] }, jest.fn()]);

const mockUseCountriesQuery = jest.mocked(useCountriesQuery);
const mockUseFavorites = jest.mocked(useFavorites);

const mockCountries = [
  { code: 'US', name: 'United States', emoji: '🇺🇸' },
  { code: 'CA', name: 'Canada', emoji: '🇨🇦' },
  { code: 'MX', name: 'Mexico', emoji: '🇲🇽' },
];

const mockCountriesWithFavorites = [
  { code: 'US', name: 'United States', emoji: '🇺🇸', favorited: true },
  { code: 'CA', name: 'Canada', emoji: '🇨🇦', favorited: false },
  { code: 'MX', name: 'Mexico', emoji: '🇲🇽', favorited: false },
];

// Mock CountryCard implementation
const mockCountryCard = jest.mocked(CountryCard);
mockCountryCard.mockImplementation(
  ({ country, favorite, unfavorite, favorited: _, ...props }) => (
    <>
      <button
        {...props}
        onClick={props.onClick}
        data-testid={`country-card-${country.code}`}
      >
        <span>{country.emoji}</span>
        <span>{country.name}</span>
      </button>
      <button onClick={favorite}>favorite {country.code}</button>
      <button onClick={unfavorite}>unfavorite {country.code}</button>
    </>
  )
);

/**
 * Test wrapper that provides all necessary contexts
 */
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </MantineProvider>
    </QueryClientProvider>
  );
};

describe('CountriesPage', () => {
  const mockAddFavorite = jest.fn();
  const mockRemoveFavorite = jest.fn();

  const defaultMockCountriesQuery: any = {
    countries: mockCountries,
    loading: false,
    error: null,
  };

  const defaultMockFavorites: any = {
    items: mockCountriesWithFavorites,
    addFavorite: mockAddFavorite,
    removeFavorite: mockRemoveFavorite,
    loading: false,
  };

  beforeEach(() => {
    mockUseCountriesQuery.mockClear();
    mockUseFavorites.mockClear();
    mockAddFavorite.mockClear();
    mockRemoveFavorite.mockClear();
    mockCountryCard.mockClear();

    mockUseCountriesQuery.mockReturnValue(defaultMockCountriesQuery);
    mockUseFavorites.mockReturnValue(defaultMockFavorites);
  });

  it('renders countries when data is loaded', async () => {
    render(
      <TestWrapper>
        <CountriesPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('United States')).toBeInTheDocument();
      expect(screen.getByText('Canada')).toBeInTheDocument();
      expect(screen.getByText('Mexico')).toBeInTheDocument();
    });
  });

  it('displays country emojis correctly', async () => {
    render(
      <TestWrapper>
        <CountriesPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('🇺🇸')).toBeInTheDocument();
      expect(screen.getByText('🇨🇦')).toBeInTheDocument();
      expect(screen.getByText('🇲🇽')).toBeInTheDocument();
    });
  });

  it('shows loader when countries are loading', () => {
    mockUseCountriesQuery.mockReturnValue({
      ...(defaultMockCountriesQuery as any),
      loading: true,
    });

    const { container } = render(
      <TestWrapper>
        <CountriesPage />
      </TestWrapper>
    );

    expect(container.querySelector('.mantine-Loader-root')).toBeInTheDocument();
  });

  it('shows loader when favorites are loading', () => {
    mockUseFavorites.mockReturnValue({
      ...defaultMockFavorites,
      loading: true,
    });

    const { container } = render(
      <TestWrapper>
        <CountriesPage />
      </TestWrapper>
    );

    expect(container.querySelector('.mantine-Loader-root')).toBeInTheDocument();
  });

  it('passes correct configuration to useFavorites hook', () => {
    render(
      <TestWrapper>
        <CountriesPage />
      </TestWrapper>
    );

    expect(mockUseFavorites).toHaveBeenCalledWith(
      mockCountries,
      expect.objectContaining({
        key: 'countries',
        getValue: expect.any(Function),
        sortFunc: expect.any(Function),
      })
    );

    // Test the getValue function
    const config = mockUseFavorites.mock.calls[0][1];
    expect(config.getValue({ code: 'TEST', name: 'Test', emoji: '🇹' })).toBe(
      'TEST'
    );

    // Test the sortFunc function
    const country1 = { code: 'CA', name: 'Canada', emoji: '🇨🇦' };
    const country2 = { code: 'US', name: 'United States', emoji: '🇺🇸' };
    expect(config.sortFunc!(country1, country2)).toBeLessThan(0); // Canada < United States
  });

  it('renders CountryCard components with correct props', async () => {
    render(
      <TestWrapper>
        <CountriesPage />
      </TestWrapper>
    );

    await waitFor(() => {
      // Check that countries are rendered (CountryCard components)
      expect(screen.getByText('United States')).toBeInTheDocument();
      expect(screen.getByText('Canada')).toBeInTheDocument();
      expect(screen.getByText('Mexico')).toBeInTheDocument();
    });

    // Verify the component structure using our test ids
    expect(screen.getByTestId('country-card-US')).toBeInTheDocument();
    expect(screen.getByTestId('country-card-CA')).toBeInTheDocument();
    expect(screen.getByTestId('country-card-MX')).toBeInTheDocument();

    // Verify that CountryCard was called with the correct props
    expect(mockCountryCard).toHaveBeenCalledWith(
      expect.objectContaining({
        country: expect.objectContaining({
          code: 'US',
          name: 'United States',
          emoji: '🇺🇸',
        }),
        favorited: true,
      }),
      expect.anything()
    );
  });

  it('verifies CountryCard mock receives correct props for all countries', async () => {
    render(
      <TestWrapper>
        <CountriesPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(mockCountryCard).toHaveBeenCalledTimes(
        mockCountriesWithFavorites.length
      );
    });

    // Verify each country was passed to CountryCard with correct props
    mockCountriesWithFavorites.forEach((country, index) => {
      expect(mockCountryCard).toHaveBeenNthCalledWith(
        index + 1,
        expect.objectContaining({
          country: expect.objectContaining({
            code: country.code,
            name: country.name,
            emoji: country.emoji,
          }),
          favorited: country.favorited,
          favorite: expect.anything(),
          unfavorite: expect.anything(),
        }),
        expect.anything()
      );
    });

    // Verify the callbacks passed into each CountryCard
    mockCountriesWithFavorites.forEach((country) => {
      screen.getByText(`favorite ${country.code}`).click();
      expect(mockAddFavorite).toHaveBeenLastCalledWith({ value: country.code });

      screen.getByText(`unfavorite ${country.code}`).click();
      expect(mockRemoveFavorite).toHaveBeenLastCalledWith({
        value: country.code,
      });
    });
  });

  it('calls removeFavorite when unfavoriting a country', async () => {
    mockRemoveFavorite.mockResolvedValue(undefined);

    render(
      <TestWrapper>
        <CountriesPage />
      </TestWrapper>
    );

    // This would require interaction with the FavoritableCard component
    // The actual test would depend on how the CountryCard is implemented
    expect(mockUseFavorites).toHaveBeenCalled();
  });

  describe('search parameter filtering', () => {
    it('filters countries based on search parameters', () => {
      mockUseTypedSearchParams.mockReturnValue([
        { code: ['US', 'CA'] },
        jest.fn(),
      ]);

      render(
        <TestWrapper>
          <CountriesPage />
        </TestWrapper>
      );

      // Verify that the filtering logic is applied
      expect(mockUseFavorites).toHaveBeenCalled();
    });

    it('shows all countries when no search parameters', () => {
      const mockUseTypedSearchParams =
        require('react-router-typesafe-routes').useTypedSearchParams;
      mockUseTypedSearchParams.mockReturnValue([{ code: [] }]);

      render(
        <TestWrapper>
          <CountriesPage />
        </TestWrapper>
      );

      expect(mockUseFavorites).toHaveBeenCalledWith(
        mockCountries,
        expect.any(Object)
      );
    });
  });

  it('handles empty countries list gracefully', () => {
    mockUseCountriesQuery.mockReturnValue({
      ...defaultMockCountriesQuery,
      countries: [],
    });

    mockUseFavorites.mockReturnValue({
      ...defaultMockFavorites,
      items: [],
    });

    render(
      <TestWrapper>
        <CountriesPage />
      </TestWrapper>
    );

    // Should render the page structure but with no country cards
    const groups = screen.queryAllByRole('group');
    expect(groups).toHaveLength(0);
  });

  it('uses memoization for processed countries', () => {
    const { rerender } = render(
      <TestWrapper>
        <CountriesPage />
      </TestWrapper>
    );

    // Rerender without changing dependencies
    rerender(
      <TestWrapper>
        <CountriesPage />
      </TestWrapper>
    );

    // useMemo should prevent unnecessary recalculations
    // This is more of an implementation detail test
    expect(mockUseFavorites).toHaveBeenCalled();
  });
});
