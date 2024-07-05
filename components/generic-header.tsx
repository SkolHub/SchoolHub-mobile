import {
  Pressable,
  SafeAreaView,
  Text,
  useColorScheme,
  View
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Theme } from '@/lib/types';
import tw from '@/lib/tailwind';

export default function GenericHeader({
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
    <SafeAreaView style={tw`bg-secondary-50 dark:bg-primary-950 flex-row`}>
      <View style={tw`flex-row items-center gap-3 p-4`}>
        <Pressable onPress={onPress}>
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
        <Text
          style={tw`text-3xl font-bold leading-tight text-neutral-800 dark:text-neutral-200`}
        >
          {text}
        </Text>
      </View>
    </SafeAreaView>
  );
}
