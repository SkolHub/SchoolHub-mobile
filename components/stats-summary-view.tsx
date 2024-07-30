import { Text, View } from 'react-native';
import tw from '@/lib/tailwind';
import React from 'react';

export default function StatsSummaryView({
  data,
  style
}: {
  data: Array<{
    label: string;
    value: string;
  }>;
  style?: string;
}) {
  return (
    <View
      style={tw.style(
        `rounded-3xl bg-neutral-50 p-4 dark:bg-neutral-700`,
        style
      )}
    >
      <View style={tw`flex-row justify-between`}>
        {data.map((item, index) => (
          <View
            key={index}
            style={tw.style(
              `flex-1 items-stretch border-r border-black/15 px-4 dark:border-white/20`,
              index === data.length - 1 && 'border-r-0 pr-0',
              index === 0 && 'pl-0'
            )}
          >
            <Text
              style={tw`text-center text-lg font-bold text-primary-800 dark:text-primary-50`}
            >
              {item.value}
            </Text>
            <Text
              style={tw`text-center text-xs font-semibold text-primary-700 dark:text-primary-200`}
            >
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
