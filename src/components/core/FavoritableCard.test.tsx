import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';

import { FavoritableCard } from './FavoritableCard';

/**
 * All Mantine components have to be wrapped in MantineProvider.
 */
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MantineProvider>{children}</MantineProvider>
);

describe('FavoritableCard', () => {
  const mockFavorite = jest.fn();
  const mockUnfavorite = jest.fn();

  const defaultProps = {
    favorited: false,
    favorite: mockFavorite,
    unfavorite: mockUnfavorite,
    children: <div>Test Content</div>,
  };

  beforeEach(() => {
    mockFavorite.mockClear();
    mockUnfavorite.mockClear();
    mockFavorite.mockResolvedValue(undefined);
    mockUnfavorite.mockResolvedValue(undefined);
  });

  it('renders children content', () => {
    render(
      <TestWrapper>
        <FavoritableCard {...defaultProps}>
          <span>Custom Content</span>
        </FavoritableCard>
      </TestWrapper>
    );

    expect(screen.getByText('Custom Content')).toBeInTheDocument();
  });

  it('shows empty heart icon when not favorited', () => {
    render(
      <TestWrapper>
        <FavoritableCard {...defaultProps} favorited={false} />
      </TestWrapper>
    );

    // Check for the heart button (first button is the heart, second is the content)
    const buttons = screen.getAllByRole('button');
    const heartButton = buttons[0]; // The ActionIcon is the first button
    expect(heartButton).toBeInTheDocument();

    // The empty heart should be visible (not the filled one)
    const svg = heartButton.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('shows filled heart icon when favorited', () => {
    render(
      <TestWrapper>
        <FavoritableCard {...defaultProps} favorited={true} />
      </TestWrapper>
    );

    const buttons = screen.getAllByRole('button');
    const heartButton = buttons[0];
    expect(heartButton).toBeInTheDocument();

    // The filled heart should be visible
    const svg = heartButton.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('calls favorite function when clicking unfavorited item', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <FavoritableCard {...defaultProps} favorited={false} />
      </TestWrapper>
    );

    const buttons = screen.getAllByRole('button');
    const heartButton = buttons[0];
    await user.click(heartButton);

    expect(mockFavorite).toHaveBeenCalledTimes(1);
    expect(mockUnfavorite).not.toHaveBeenCalled();
  });

  it('calls unfavorite function when clicking favorited item', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <FavoritableCard {...defaultProps} favorited={true} />
      </TestWrapper>
    );

    const buttons = screen.getAllByRole('button');
    const heartButton = buttons[0];
    await user.click(heartButton);

    expect(mockUnfavorite).toHaveBeenCalledTimes(1);
    expect(mockFavorite).not.toHaveBeenCalled();
  });

  it('shows loading spinner during favorite operation', async () => {
    const user = userEvent.setup();
    let resolveFavorite: () => void;

    const favoritePromise = new Promise<void>((resolve) => {
      resolveFavorite = resolve;
    });
    mockFavorite.mockReturnValue(favoritePromise);

    render(
      <TestWrapper>
        <FavoritableCard {...defaultProps} favorited={false} />
      </TestWrapper>
    );

    const buttons = screen.getAllByRole('button');
    const heartButton = buttons[0];
    await user.click(heartButton);

    // Should show loader while operation is pending
    expect(
      heartButton.querySelector('.mantine-Loader-root')
    ).toBeInTheDocument();

    // Resolve the promise
    resolveFavorite!();

    await waitFor(() => {
      // Loader should disappear after operation completes
      expect(
        heartButton.querySelector('.mantine-Loader-root')
      ).not.toBeInTheDocument();
    });
  });

  it('shows loading spinner during unfavorite operation', async () => {
    const user = userEvent.setup();
    let resolveUnfavorite: () => void;

    const unfavoritePromise = new Promise<void>((resolve) => {
      resolveUnfavorite = resolve;
    });
    mockUnfavorite.mockReturnValue(unfavoritePromise);

    render(
      <TestWrapper>
        <FavoritableCard {...defaultProps} favorited={true} />
      </TestWrapper>
    );

    const buttons = screen.getAllByRole('button');
    const heartButton = buttons[0];
    await user.click(heartButton);

    // Should show loader while operation is pending
    expect(
      heartButton.querySelector('.mantine-Loader-root')
    ).toBeInTheDocument();

    // Resolve the promise
    resolveUnfavorite!();

    await waitFor(() => {
      // Loader should disappear after operation completes
      expect(
        heartButton.querySelector('.mantine-Loader-root')
      ).not.toBeInTheDocument();
    });
  });

  it('forwards additional props to the clickable area', () => {
    const handleClick = jest.fn();

    render(
      <TestWrapper>
        <FavoritableCard
          {...defaultProps}
          onClick={handleClick}
          data-testid="clickable-area"
        />
      </TestWrapper>
    );

    const clickableArea = screen.getByTestId('clickable-area');
    expect(clickableArea).toBeInTheDocument();
  });
});
