import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';

import { HomePage } from './HomePage';

/**
 * Test wrapper that provides Mantine theme context
 */
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MantineProvider>{children}</MantineProvider>
);

describe('HomePage', () => {
  it('renders the home page heading', () => {
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );

    expect(screen.getByRole('heading', { name: /home page/i })).toBeInTheDocument();
  });

  it('displays welcome message and navigation instructions', () => {
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );

    expect(screen.getByText(/welcome!/i)).toBeInTheDocument();
    expect(screen.getByText(/use the nav bar on the left to select a page/i)).toBeInTheDocument();
  });

  it('has proper semantic structure with container and stack layout', () => {
    const { container } = render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );

    // Check that content is properly containerized
    expect(container.querySelector('.mantine-Container-root')).toBeInTheDocument();
    expect(container.querySelector('.mantine-Stack-root')).toBeInTheDocument();
  });

  it('applies correct heading hierarchy', () => {
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );

    const heading = screen.getByRole('heading', { name: /home page/i });
    expect(heading.tagName).toBe('H1');
  });
});