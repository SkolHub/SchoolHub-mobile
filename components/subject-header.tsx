import {
  Pressable,
  SafeAreaView,
  Text,
  useColorScheme,
  View
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { Icons } from '@/lib/icons';
import tw from '@/lib/tailwind';
import { Theme } from '@/lib/types';

export default function SubjectHeader({
  text,
  icon,
  onPress,
  theme = 'blue'
}: {
  text: string;
  icon: string;
  onPress: () => void;
  theme?: Theme;
}) {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView
      style={tw`bg-secondary-50 android:pt-10 dark:bg-primary-950 flex-row`}
    >
      <View style={tw`flex-row items-center gap-3 p-4`}>
        <Pressable
          android_ripple={{
            color: 'rgba(255, 255, 255)',
            borderless: true,
            radius: 25,
            foreground: false
          }}
          onPress={onPress}
          style={tw`rounded-full p-3`}
        >
          <Ionicons
            name='chevron-back'
            size={24}
            color={
              colorScheme === 'light'
                ? tw.color(`primary-800`)
                : tw.color(`primary-200`)
            }
          />
        </Pressable>
        <Image
          contentFit='contain'
          source={Icons.find((i) => i.name === icon)?.icon ?? Icons[0].icon}
          style={{ width: 50, height: 50 }}
        />
        <Text
          style={tw`pl-2 text-2xl font-bold leading-tight text-neutral-800 dark:text-neutral-200`}
        >
          {text}
        </Text>
      </View>
    </SafeAreaView>
  );
}
