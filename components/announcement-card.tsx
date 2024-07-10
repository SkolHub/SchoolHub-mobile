import { Pressable, Text, View } from 'react-native';
import tw from '@/lib/tailwind';
import { Theme } from '@/lib/types';
import { androidRipple } from '@/lib/utils';

export default function AnnouncementCard({
  title,
  body,
  date,
  onPress,
  theme = 'blue'
}: {
  title: string;
  body: string;
  date: string;
  onPress: () => void;
  theme?: Theme;
}) {
  return (
    <Pressable
      onPress={onPress}
      android_ripple={androidRipple}
      style={({ pressed }) =>
        tw.style(
          `mb-3 gap-2 rounded-3xl bg-neutral-50 p-4 dark:bg-neutral-700`,
          pressed && 'ios:opacity-70'
        )
      }
    >
      <View style={tw`flex-row items-center justify-between gap-2`}>
        <Text
          style={tw`flex-1 text-base font-bold leading-tight text-primary-800 dark:text-primary-200`}
        >
          {title}
        </Text>
        <Text
          style={tw`text-sm font-semibold text-primary-600 dark:text-primary-300`}
        >
          {date}
        </Text>
      </View>
      <Text
        style={tw`text-[15px] font-medium text-primary-700 dark:text-primary-200`}
      >
        {body.trim()}
      </Text>
    </Pressable>
  );
}
