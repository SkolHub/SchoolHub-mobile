import tw from '@/lib/tailwind';
import { Pressable, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Stepper({
  onPressMinus,
  onPressPlus,
  value = 0
}: {
  onPressMinus: () => void;
  onPressPlus: () => void;
  value: number;
}) {
  return (
    <View
      style={tw`flex-row items-center justify-center gap-4 rounded-xl bg-neutral-200 py-2 dark:bg-neutral-600`}
    >
      <Pressable
        style={tw`items-center justify-center border-r border-black/20 px-4 dark:border-white/20`}
        onPress={onPressMinus}
      >
        <Ionicons
          name={'remove-outline'}
          size={20}
          color={
            tw.prefixMatch('dark')
              ? tw.color('neutral-200')
              : tw.color('neutral-900')
          }
        />
      </Pressable>
      <Text style={tw`px-1 text-base tabular-nums dark:text-white`}>
        {value}
      </Text>
      <Pressable
        style={tw`items-center justify-center border-l border-black/20 px-4 dark:border-white/20`}
        onPress={onPressPlus}
      >
        <Ionicons
          name={'add-outline'}
          size={20}
          color={
            tw.prefixMatch('dark')
              ? tw.color('neutral-200')
              : tw.color('neutral-900')
          }
        />
      </Pressable>
    </View>
  );
}
