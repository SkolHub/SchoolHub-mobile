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
  secondaryText,
  icon,
  onPress,
  theme = 'blue'
}: {
  text: string;
  secondaryText?: string;
  icon: string;
  onPress: () => void;
  theme?: Theme;
}) {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView
      style={tw`android:pt-10 flex-row bg-secondary-100 dark:bg-primary-950`}
    >
      <View style={tw`w-full flex-row items-center gap-3 p-4`}>
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
        <View style={tw`flex-1`}>
          <Text
            style={tw`w-full pl-2 text-2xl font-bold leading-tight text-primary-800 dark:text-primary-200`}
          >
            {text}
          </Text>
          {secondaryText && (
            <Text
              style={tw`w-full pl-2 text-base font-semibold leading-tight text-primary-700 dark:text-primary-100`}
            >
              {secondaryText}
            </Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
