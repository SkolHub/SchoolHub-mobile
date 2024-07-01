import React from 'react';
import { Pressable, Text } from 'react-native';
import tw from '@/lib/tailwind';
import { Style } from 'twrnc';

export default function LinkButton({
  text,
  style,
  onPress
}: {
  text: string;
  style?: Style;
  onPress: () => void;
}) {
  return (
    <Pressable style={style} onPress={onPress}>
      <Text style={tw`text-base text-black/80 underline dark:text-white/80`}>
        {text}
      </Text>
    </Pressable>
  );
}
