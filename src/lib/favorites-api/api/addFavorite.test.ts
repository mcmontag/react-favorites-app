import { mutateFavorites } from './mutateFavorites';
import { addFavorite } from './addFavorite';
import { FavoritesKey } from './config';

jest.mock('./mutateFavorites');
const mockMutateFavorites = jest.mocked(mutateFavorites);

describe('addFavorite', () => {
  const testMutateResult = { success: true, id: 'test-id' } as any;

  beforeEach(() => {
    mockMutateFavorites.mockClear();
    mockMutateFavorites.mockResolvedValue(testMutateResult);
  });

  it('calls mutateFavorites with ADD operation', async () => {
    const args = {
      key: 'whatever' as FavoritesKey,
      value: 'US',
      userId: 123,
    };

    await addFavorite(args);

    expect(mockMutateFavorites).toHaveBeenCalledWith({
      ...args,
      op: 'ADD',
    });
  });

  it('passes through all provided arguments', async () => {
    const args = {
      key: 'whatever' as FavoritesKey,
      value: 'test-value',
      userId: 456,
    };

    await addFavorite(args);

    expect(mockMutateFavorites).toHaveBeenCalledTimes(1);
    expect(mockMutateFavorites).toHaveBeenCalledWith({
      key: 'whatever' as FavoritesKey,
      value: 'test-value',
      userId: 456,
      op: 'ADD',
    });
  });

  it('returns the result from mutateFavorites', async () => {
    mockMutateFavorites.mockResolvedValue(testMutateResult);

    const args = {
      key: 'whatever' as FavoritesKey,
      value: 'CA',
      userId: 789,
    };

    const result = await addFavorite(args);

    expect(result).toEqual(testMutateResult);
  });

  it('propagates errors from mutateFavorites', async () => {
    const error = new Error('Network error');
    mockMutateFavorites.mockRejectedValue(error);

    const args = {
      key: 'whatever' as FavoritesKey,
      value: 'MX',
      userId: 101,
    };

    await expect(addFavorite(args)).rejects.toThrow('Network error');
  });
});
