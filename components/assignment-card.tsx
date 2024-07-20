import { Pressable, Text, useColorScheme, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import tw from '@/lib/tailwind';
import { Theme } from '@/lib/types';

export default function AssignmentCard({
  title,
  dueDate,
  date,
  onPress,
  theme = 'blue'
}: {
  title: string;
  dueDate: string | null;
  date: string;
  onPress: () => void;
  theme?: Theme;
}) {
  const colorScheme = useColorScheme();

  return (
    <Pressable
      onPress={onPress}
      android_ripple={{
        color: 'rgb(0, 0, 0)',
        borderless: false,
        radius: 30
      }}
      style={({ pressed }) =>
        tw.style(
          `mb-3 flex-row items-center gap-2 rounded-3xl bg-neutral-50 p-4 dark:bg-neutral-700`,
          pressed && 'ios:opacity-70'
        )
      }
    >
      <Ionicons
        name='clipboard-outline'
        size={30}
        color={
          colorScheme === 'light'
            ? tw.color(`primary-800`)
            : tw.color(`primary-200`)
        }
      />
      <View style={tw`flex-1`}>
        <View style={tw`flex-row items-start justify-between gap-2`}>
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
          style={tw`text-sm font-semibold text-primary-700 dark:text-primary-300`}
        >
          {dueDate ? 'Due ' : 'No due date'}
          {dueDate}
        </Text>
      </View>
    </Pressable>
  );
}
