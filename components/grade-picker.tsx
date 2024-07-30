import { Pressable, Text, View } from 'react-native';
import tw from '@/lib/tailwind';
import { androidRipple } from '@/lib/utils';
import React from 'react';

export default function GradePicker({
  value,
  onSelect,
  style
}: {
  value: number;
  onSelect: (grade: number) => void;
  style?: string;
}) {
  const grades1 = [1, 2, 3, 4, 5];
  const grades2 = [6, 7, 8, 9, 10];

  return (
    <View style={tw.style('rounded-2xl', style)}>
      <View
        style={tw.style(
          `w-full flex-row flex-wrap items-center justify-center gap-2 rounded-2xl p-2`
        )}
      >
        {grades1.map((grade) => (
          <View key={grade} style={tw`overflow-hidden rounded-full`}>
            <Pressable
              onPress={() => onSelect(grade)}
              android_ripple={androidRipple}
              style={({ pressed }) =>
                tw.style(
                  `h-12 w-12 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-600`,
                  pressed && 'ios:opacity-70',
                  value === grade &&
                    `border-4 border-primary-500 dark:border-primary-300`
                )
              }
            >
              <Text style={tw`text-lg text-black dark:text-white`}>
                {grade}
              </Text>
            </Pressable>
          </View>
        ))}
      </View>
      <View
        style={tw.style(
          `w-full flex-row flex-wrap items-center justify-center gap-2 rounded-2xl p-2`
        )}
      >
        {grades2.map((grade) => (
          <View key={grade} style={tw`overflow-hidden rounded-full`}>
            <Pressable
              onPress={() => onSelect(grade)}
              android_ripple={androidRipple}
              style={({ pressed }) =>
                tw.style(
                  `h-12 w-12 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-600`,
                  pressed && 'ios:opacity-70',
                  value === grade &&
                    `border-4 border-primary-500 dark:border-primary-300`
                )
              }
            >
              <Text style={tw`text-lg text-black dark:text-white`}>
                {grade}
              </Text>
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
}
