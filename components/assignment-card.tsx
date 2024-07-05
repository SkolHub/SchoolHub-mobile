import { Pressable, Text, useColorScheme, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import tw from '@/lib/tailwind';
import { Theme } from '@/lib/types';

export default function AssignmentCard({
  title,
  dueDate,
  onPress,
  theme = 'blue'
}: {
  title: string;
  dueDate: string;
  onPress: () => void;
  theme?: Theme;
}) {
  const colorScheme = useColorScheme();

  return (
    <Pressable
      onPress={onPress}
      style={tw`mb-3 flex-row items-center gap-2 rounded-3xl bg-neutral-50 p-4 dark:bg-neutral-700`}
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
      <View>
        <Text
          style={tw`text-primary-800 dark:text-primary-200 text-lg font-bold leading-tight`}
        >
          {title}
        </Text>
        <Text
          style={tw`text-primary-700 dark:text-primary-300 text-sm font-semibold`}
        >
          Due {dueDate}
        </Text>
      </View>
    </Pressable>
  );
}
