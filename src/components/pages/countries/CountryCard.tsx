import { useMemo } from 'react';
import {
  ActionIcon,
  Card,
  Collapse,
  Drawer,
  Group,
  Loader,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';

import { useCountryQuery } from '../../../queries/useCountryQuery';
import { CompactCountry, Country } from '../../../types/Country';

import {
  FavoritableCard,
  FavoritableCardProps,
} from '../../core/FavoritableCard';

/**
 * Card component for displaying country information with favorite functionality.
 * Clicking the card opens a drawer with detailed country information.
 */
export function CountryCard({
  country,
  ...props
}: FavoritableCardProps & {
  country: CompactCountry;
}) {
  const [opened, { open, close }] = useDisclosure(false);
  const [fetchDetails, { country: details, loading }] = useCountryQuery.lazy();

  const content = useMemo(() => {
    if (!opened) return null;
    if (loading) return <Loader />;

    if (!details) {
      close();
      return null;
    }

    return <CountryDetails details={details} />;
  }, [opened, loading, details]);

  return (
    <>
      <FavoritableCard
        {...props}
        onClick={(e) => {
          open();
          fetchDetails(country.code);
          props.onClick?.(e);
        }}
      >
        <Group>
          <Title>{country.emoji}</Title>
          <Text>{country.name}</Text>
        </Group>
      </FavoritableCard>
      <Drawer
        title={
          <Group>
            <Title size="3rem">{country.emoji}</Title>
            <Title size="2rem"> {country.name}</Title>
          </Group>
        }
        opened={opened}
        onClose={close}
        closeOnClickOutside
      >
        {content}
      </Drawer>
    </>
  );
}

/**
 * Detailed view component that displays comprehensive country information
 * including AWS region and languages with expandable sections.
 */
function CountryDetails({ details }: { details: Country }) {
  const [languagesOpened, { toggle }] = useDisclosure(false);

  return (
    <Stack gap="lg">
      <Title size="1.5rem">Details</Title>
      <Card shadow="xs">
        <Group>
          <Text>AWS REGION</Text>
          <Text>{details.awsRegion}</Text>
        </Group>
      </Card>
      <Card>
        <Stack gap="xs">
          <Group>
            <Text>LANGUAGES</Text>
            <ActionIcon onClick={toggle} variant="transparent" size="input-sm">
              {languagesOpened ? (
                <IconChevronDown color="var(--mantine-color-text)" />
              ) : (
                <IconChevronRight color="var(--mantine-color-text)" />
              )}
            </ActionIcon>
          </Group>
          <Collapse in={languagesOpened}>
            <Stack gap="xs" pl="lg">
              {details.languages.map(({ name }) => {
                return (
                  <Group>
                    <Text>{name}</Text>
                  </Group>
                );
              })}
            </Stack>
          </Collapse>
        </Stack>
      </Card>
    </Stack>
  );
}
