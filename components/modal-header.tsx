import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import tw from '@/lib/tailwind';
import { Theme } from '@/lib/types';

export default function ModalHeader({
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
      style={tw`flex-row items-center bg-secondary-${theme}-100 px-4 py-6 dark:bg-primary-${theme}-950`}
    >
      <View style={tw`flex-row items-center px-4 py-6`}>
        <Text
          style={tw`flex-1 text-4xl font-bold text-primary-${theme}-800 dark:text-primary-${theme}-50`}
        >
          {text}
        </Text>
        <TouchableOpacity
          onPress={onPress}
          style={tw`rounded-full bg-primary-${theme}-200 p-2 dark:bg-primary-${theme}-900`}
        >
          <Ionicons
            name='close'
            size={30}
            color={
              colorScheme === 'light'
                ? tw.color(`primary-${theme}-800`)
                : tw.color(`primary-${theme}-200`)
            }
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
