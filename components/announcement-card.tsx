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
              ? tw.color(`primary-800`)
              : tw.color(`primary-200`)
          }
        />
        <Text
          style={tw`text-primary-800 dark:text-primary-200 mr-auto text-lg font-bold leading-tight`}
        >
          {title}
        </Text>
        <Text
          style={tw`text-primary-600 dark:text-primary-300 text-sm font-semibold`}
        >
          {date}
        </Text>
      </View>
      <Text
        style={tw`text-primary-800 dark:text-primary-50 text-sm font-medium`}
      >
        {body}
      </Text>
    </View>
  );
}
