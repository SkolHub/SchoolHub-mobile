import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, View } from 'react-native';
import tw from '@/lib/tailwind';
import { androidRipple } from '@/lib/utils';

export default function IconButton({
  icon,
  onPress,
  color = 'black',
  style
}: {
  icon: string;
  onPress: () => void;
  color?: string;
  style?: string;
}) {
  return (
    <View style={tw`overflow-hidden rounded-full`}>
      <Pressable
        onPress={onPress}
        android_ripple={androidRipple}
        style={({ pressed }) =>
          tw.style(pressed && 'ios:opacity-80', 'p-2', style)
        }
      >
        <Ionicons name={icon as any} size={28} color={color} />
      </Pressable>
    </View>
  );
}
