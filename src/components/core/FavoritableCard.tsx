import React, { useState } from 'react';
import {
  ActionIcon,
  Card,
  Flex,
  Loader,
  PolymorphicComponentProps,
  UnstyledButton,
} from '@mantine/core';
import { IconHeart, IconHeartFilled } from '@tabler/icons-react';

/**
 * Props for the FavoritableCard component
 */
export type FavoritableCardProps = PolymorphicComponentProps<
  'button',
  {
    favorited: boolean;
    favorite: () => Promise<void>;
    unfavorite: () => Promise<void>;
  }
>;

/**
 * A reusable card component that displays content with a favorite toggle button.
 * Features a heart icon that shows filled when favorited, empty when not favorited,
 * and a loading spinner during favorite/unfavorite operations.
 */
export function FavoritableCard({
  favorited,
  favorite,
  unfavorite,
  children,
  ...props
}: React.PropsWithChildren<FavoritableCardProps>) {
  const [loading, setLoading] = useState(false);

  return (
    <Card shadow="xs" color="var(--mantine-color-dimmed)" p={0}>
      <Flex align="center" gap={0}>
        <ActionIcon
          variant="transparent"
          m="md"
          onClick={async () => {
            setLoading(true);

            const handler = favorited ? unfavorite : favorite;

            await handler().finally(() => setLoading(false));
          }}
        >
          {loading ? (
            <Loader size="xs" color="var(--mantine-color-red-filled)" />
          ) : favorited ? (
            <IconHeartFilled color="var(--mantine-color-red-filled)" />
          ) : (
            <IconHeart color="var(--mantine-color-red-light)" />
          )}
        </ActionIcon>
        <UnstyledButton w="100%" h="100%" p="sm" pl={0} {...props}>
          {children}
        </UnstyledButton>
      </Flex>
    </Card>
  );
}
