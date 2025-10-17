import { renderHook } from '@testing-library/react';

import { FavoritesKey } from '../api/config';

import { useFavorites } from './useFavorites';
import { useKeyedFavoritesApi } from './useKeyedFavoritesApi';

jest.mock('./useKeyedFavoritesApi');

interface TestItem {
  id: string;
  name: string;
}

const mockItems: TestItem[] = [
  { id: '1', name: 'Item 1' },
  { id: '2', name: 'Item 2' },
  { id: '3', name: 'Item 3' },
];

const mockConfig = {
  key: FavoritesKey.COUNTRIES,
  getValue: (item: TestItem) => item.id,
  sortFunc: (a: TestItem, b: TestItem) => a.name.localeCompare(b.name),
};

describe('useFavorites', () => {
  const mockAddFavorite = jest.fn();
  const mockRemoveFavorite = jest.fn();

  beforeEach(() => {
    mockAddFavorite.mockClear();
    mockRemoveFavorite.mockClear();
    jest.mocked(useKeyedFavoritesApi).mockClear();

    jest.mocked(useKeyedFavoritesApi).mockReturnValue({
      favorites: {},
      loading: false,
      error: null,
      addFavorite: mockAddFavorite,
      removeFavorite: mockRemoveFavorite,
      refetch: jest.fn(),
    });
  });

  it('decorates items with favorited property', () => {
    const { result } = renderHook(() => useFavorites(mockItems, mockConfig));

    expect(result.current.items).toHaveLength(3);
    result.current.items.forEach((item) => {
      expect(item).toHaveProperty('favorited', false);
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('name');
    });
  });

  it('marks items as favorited when they exist in favorites', () => {
    jest.mocked(useKeyedFavoritesApi).mockReturnValue({
      favorites: { '1': true, '3': true },
      loading: false,
      error: null,
      addFavorite: mockAddFavorite,
      removeFavorite: mockRemoveFavorite,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useFavorites(mockItems, mockConfig));

    // Find items by ID since sorting may change order
    const item1 = result.current.items.find((item) => item.id === '1');
    const item2 = result.current.items.find((item) => item.id === '2');
    const item3 = result.current.items.find((item) => item.id === '3');

    expect(item1?.favorited).toBe(true);
    expect(item2?.favorited).toBe(false);
    expect(item3?.favorited).toBe(true);
  });

  it('sorts items with favorites first', () => {
    jest.mocked(useKeyedFavoritesApi).mockReturnValue({
      favorites: { '2': true }, // Only Item 2 is favorited
      loading: false,
      error: null,
      addFavorite: mockAddFavorite,
      removeFavorite: mockRemoveFavorite,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useFavorites(mockItems, mockConfig));

    // Item 2 should be first (favorited)
    expect(result.current.items[0].id).toBe('2');
    expect(result.current.items[0].favorited).toBe(true);

    // Remaining items should be sorted alphabetically
    expect(result.current.items[1].favorited).toBe(false);
    expect(result.current.items[2].favorited).toBe(false);
  });

  it('passes through favorites API functions', () => {
    const { result } = renderHook(() => useFavorites(mockItems, mockConfig));

    expect(result.current.addFavorite).toBe(mockAddFavorite);
    expect(result.current.removeFavorite).toBe(mockRemoveFavorite);
  });

  it('passes through loading and error states', () => {
    jest.mocked(useKeyedFavoritesApi).mockReturnValue({
      favorites: {},
      addFavorite: mockAddFavorite,
      removeFavorite: mockRemoveFavorite,
      loading: true,
      error: new Error('Test error'),
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useFavorites(mockItems, mockConfig));

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toEqual(new Error('Test error'));
  });

  it('calls useKeyedFavoritesApi with correct parameters', () => {
    renderHook(() => useFavorites(mockItems, mockConfig));

    expect(useKeyedFavoritesApi).toHaveBeenCalledWith(
      FavoritesKey.COUNTRIES,
      expect.objectContaining({
        enabled: true,
      })
    );
  });

  it('disables query when items array is empty', () => {
    renderHook(() => useFavorites([], mockConfig));

    expect(useKeyedFavoritesApi).toHaveBeenCalledWith(
      FavoritesKey.COUNTRIES,
      expect.objectContaining({
        enabled: false,
      })
    );
  });

  it('returns empty items array when input is empty', () => {
    const { result } = renderHook(() => useFavorites([], mockConfig));

    expect(result.current.items).toEqual([]);
  });
});
