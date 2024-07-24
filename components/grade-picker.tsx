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
  const grades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <View
      style={tw.style(
        `w-full flex-row flex-wrap items-center justify-center gap-3 rounded-2xl p-2`,
        style
      )}
    >
      {grades.map((grade) => (
        <View key={grade} style={tw`overflow-hidden rounded-full`}>
          <Pressable
            onPress={() => onSelect(grade)}
            android_ripple={androidRipple}
            style={({ pressed }) =>
              tw.style(
                `h-14 w-14 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-600`,
                pressed && 'ios:opacity-70',
                value === grade &&
                  `border-4 border-primary-500 dark:border-primary-300`
              )
            }
          >
            <Text style={tw`text-lg text-black dark:text-white`}>{grade}</Text>
          </Pressable>
        </View>
      ))}
    </View>
  );
}
