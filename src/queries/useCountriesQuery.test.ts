import { renderHook, waitFor } from '@testing-library/react';

import { useQuery } from '@apollo/client';
import { useCountriesQuery } from './useCountriesQuery';

// Simple test to verify the hook structure and defaults
describe('useCountriesQuery', () => {
  it('has the correct interface', () => {
    jest.mocked(useQuery).mockReturnValue({
      data: undefined,
      loading: false,
      error: undefined,
    } as any);

    const { result } = renderHook(() => useCountriesQuery());

    // Check that it returns the expected shape
    expect(result.current).toHaveProperty('countries');
    expect(result.current).toHaveProperty('loading');
    expect(Array.isArray(result.current.countries)).toBe(true);
  });

  it('returns empty array when no data', () => {
    jest.mocked(useQuery).mockReturnValue({
      data: undefined,
      loading: false,
      error: undefined,
    } as any);

    const { result } = renderHook(() => useCountriesQuery());

    expect(result.current.countries).toEqual([]);
  });

  it('returns countries data when available', () => {
    const mockCountries = [
      { code: 'US', name: 'United States', emoji: '🇺🇸' },
      { code: 'CA', name: 'Canada', emoji: '🇨🇦' },
    ];

    jest.mocked(useQuery).mockReturnValue({
      data: { countries: mockCountries },
      loading: false,
      error: undefined,
    } as any);

    const { result } = renderHook(() => useCountriesQuery());

    expect(result.current.countries).toEqual(mockCountries);
    expect(result.current.loading).toBe(false);
  });
});
