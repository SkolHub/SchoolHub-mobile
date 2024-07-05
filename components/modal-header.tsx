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
      style={tw`bg-secondary-100 dark:bg-primary-950 flex-row items-center px-4 py-6`}
    >
      <View style={tw`flex-row items-center px-4 py-6`}>
        <Text
          style={tw`text-primary-800 dark:text-primary-50 flex-1 text-4xl font-bold`}
        >
          {text}
        </Text>
        <TouchableOpacity
          onPress={onPress}
          style={tw`bg-primary-200 dark:bg-primary-900 rounded-full p-2`}
        >
          <Ionicons
            name='close'
            size={30}
            color={
              colorScheme === 'light'
                ? tw.color(`primary-800`)
                : tw.color(`primary-200`)
            }
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
