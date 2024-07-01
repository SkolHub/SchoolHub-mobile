import { Pressable, Text, useColorScheme, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import tw from '@/lib/tailwind';

export default function ListItem({
  text,
  onPress,
  rightComponent,
  textStyle,
  firstItem,
  lastItem
}: {
  text: string;
  onPress?: () => void;
  rightComponent?: React.ReactNode;
  textStyle?: string;
  firstItem?: boolean;
  lastItem?: boolean;
}) {
  const colorScheme = useColorScheme();

  return (
    <Pressable
      onPress={onPress}
      style={tw.style(
        'flex-row items-center justify-between bg-neutral-50 pl-4 active:bg-neutral-200 dark:bg-neutral-700 dark:active:bg-neutral-600',
        lastItem && 'rounded-b-2xl',
        firstItem && 'rounded-t-2xl'
      )}
    >
      <View
        style={tw.style(
          'flex-1 flex-row items-center justify-between py-3 pr-4',
          lastItem ??
            'border-b-[0.7px] border-b-black/10 dark:border-b-white/10'
        )}
      >
        <Text
          style={tw.style(
            'p-0 text-base text-black dark:text-white',
            textStyle
          )}
        >
          {text}
        </Text>
        {rightComponent ? (
          rightComponent
        ) : (
          <Ionicons
            name='chevron-forward'
            size={20}
            color={
              colorScheme === 'light'
                ? 'rgba(0, 0, 0, 0.4)'
                : 'rgba(255, 255, 255, 0.4)'
            }
          />
        )}
      </View>
    </Pressable>
  );
}
