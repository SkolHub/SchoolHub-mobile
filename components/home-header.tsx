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
    <SafeAreaView
      style={tw`flex-row bg-secondary-${theme}-100 dark:bg-primary-${theme}-950`}
    >
      <View
        style={tw`android:pt-10 mt-10 flex-1 flex-row items-center justify-center px-4 pb-4`}
      >
        <Text
          style={tw`flex-1 text-3xl font-bold text-primary-${theme}-800 dark:text-primary-${theme}-100`}
        >
          {text}
        </Text>
        <Pressable
          onPress={onPress}
          style={tw`shrink active:opacity-80 justify-center`}
        >
          <Ionicons
            name='person-circle-outline'
            size={44}
            color={
              colorScheme === 'dark'
                ? tw.color('primary-blue-200')
                : tw.color('primary-blue-800')
            }
            style={tw`w-11 h-11`}
            source={profileImage}
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
