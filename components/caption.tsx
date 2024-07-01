import { Text } from 'react-native';
import React from 'react';
import { cn } from '@/lib/utils';
import { Theme } from '@/lib/types';
import tw from '@/lib/tailwind';

export default function Caption({
  text,
  style,
  theme = 'blue'
}: {
  text: string;
  style?: string;
  theme?: Theme;
}) {
  return (
    <Text
      style={tw.style(
        `py-4 text-xl font-bold text-primary-${theme}-800 dark:text-primary-${theme}-50`,
        style
      )}
    >
      {text}
    </Text>
  );
}
