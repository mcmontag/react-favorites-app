import {
  MantineColorScheme,
  SegmentedControl,
  SegmentedControlItem,
  useMantineColorScheme,
} from '@mantine/core';

const COLOR_SCHEME_OPTIONS: Record<MantineColorScheme, string> = {
  auto: 'System',
  light: 'Light',
  dark: 'Dark',
};

const COLOR_SCHEME_ITEMS: SegmentedControlItem[] = Object.entries(
  COLOR_SCHEME_OPTIONS
).map(([value, label]) => ({ label, value }));

export function ThemePicker() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  return (
    <SegmentedControl
      size="xs"
      value={colorScheme}
      onChange={(value) => setColorScheme(value as MantineColorScheme)}
      data={COLOR_SCHEME_ITEMS}
    />
  );
}
