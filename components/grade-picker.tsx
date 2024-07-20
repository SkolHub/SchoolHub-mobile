import { Pressable, Text, View } from 'react-native';
import tw from '@/lib/tailwind';
import { androidRipple } from '@/lib/utils';
import React from 'react';

export default function GradePicker({
  onSelect
}: {
  onSelect: (grade: number) => void;
}) {
  const grades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <View
      style={tw`w-full flex-row flex-wrap items-center justify-center gap-3`}
    >
      {grades.map((grade) => (
        <View key={grade} style={tw`overflow-hidden rounded-full`}>
          <Pressable
            onPress={() => onSelect(grade)}
            android_ripple={androidRipple}
            style={({ pressed }) =>
              tw.style(
                `h-14 w-14 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-600`,
                pressed && 'ios:opacity-70'
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
