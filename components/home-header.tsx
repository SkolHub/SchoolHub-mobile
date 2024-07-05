import {
  Pressable,
  SafeAreaView,
  Text,
  useColorScheme,
  View
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import tw from '@/lib/tailwind';
import { Theme } from '@/lib/types';

const profileImage = require('../assets/images/profile.png');

export default function HomeHeader({
  text,
  onPress,
  theme = 'blue'
}: {
  text: string;
  onPress: () => void;
  theme?: Theme;
}) {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView style={tw`bg-secondary-100 dark:bg-primary-950 flex-row`}>
      <View
        style={tw`android:pt-10 mt-10 flex-1 flex-row items-center justify-center px-4 pb-4`}
      >
        <Text
          style={tw`text-primary-800 flex-1 text-3xl font-bold dark:text-primary-${theme}-100`}
        >
          {text}
        </Text>
        <Pressable
          onPress={onPress}
          style={tw`shrink justify-center active:opacity-80`}
        >
          <Ionicons
            name='person-circle-outline'
            size={44}
            color={
              colorScheme === 'dark'
                ? tw.color('primary-200')
                : tw.color('primary-800')
            }
            style={tw`h-11 w-11`}
            source={profileImage}
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
