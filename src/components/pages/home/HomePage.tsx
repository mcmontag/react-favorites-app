import { Title, Text, Stack, Container } from '@mantine/core';

/**
 * Home page component that displays a welcome message and navigation instructions.
 */
export function HomePage() {
  return (
    <Container size="md">
      <Stack gap="md">
        <Title order={1}>Home Page</Title>
        <Text size="lg">
          Welcome! Use the nav bar on the left to select a page.
        </Text>
      </Stack>
    </Container>
  );
}
