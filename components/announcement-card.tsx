import { Text, useColorScheme, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import tw from '@/lib/tailwind';
import { Theme } from '@/lib/types';

export default function AnnouncementCard({
  title,
  body,
  date,
  theme = 'blue'
}: {
  title: string;
  body: string;
  date: string;
  theme?: Theme;
}) {
  const colorScheme = useColorScheme();

  return (
    <View
      style={tw`mb-3 gap-2 rounded-3xl bg-neutral-50 p-4 dark:bg-neutral-700`}
    >
      <View style={tw`flex-row items-center gap-2`}>
        <Ionicons
          name='document-text-outline'
          size={30}
          color={
            colorScheme === 'light'
              ? tw.color(`primary-${theme}-800`)
              : tw.color(`primary-${theme}-200`)
          }
        />
        <Text
          style={tw`mr-auto text-lg font-bold leading-tight text-primary-${theme}-800 dark:text-primary-${theme}-200`}
        >
          {title}
        </Text>
        <Text
          style={tw`text-sm font-semibold text-primary-${theme}-600 dark:text-primary-${theme}-300`}
        >
          {date}
        </Text>
      </View>
      <Text
        style={tw`text-sm font-medium text-primary-${theme}-800 dark:text-primary-${theme}-50`}
      >
        {body}
      </Text>
    </View>
  );
}
