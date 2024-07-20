import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from '@/lib/tailwind';
import { Theme } from '@/lib/types';

export default function LargeButton({
  text,
  style,
  contentContainerStyle,
  textStyle,
  onPress,
  iconName,
  iconColor = 'white',
  theme = 'blue'
}: {
  text: string;
  textStyle?: string;
  style?: string;
  contentContainerStyle?: string;
  onPress: () => void;
  iconName?: string;
  iconColor?: string;
  theme?: Theme;
}) {
  return (
    <Pressable
      android_ripple={{
        color: 'rgba(0, 0, 0)',
        borderless: false,
        radius: 200,
        foreground: true
      }}
      onPress={onPress}
      style={({ pressed }) => {
        return tw.style(pressed && `ios:opacity-50`, style);
      }}
    >
      <View
        style={tw.style(
          `h-14 w-full flex-row items-center justify-center rounded-[16.5] bg-primary-600`,
          contentContainerStyle
        )}
      >
        {iconName && (
          <Ionicons
            name={iconName as any}
            size={28}
            color={iconColor}
            style={tw.style(text ? `mr-2` : ``, textStyle)}
          />
        )}
        <Text
          style={tw.style(`text-lg font-semibold text-primary-50`, textStyle)}
        >
          {text}
        </Text>
      </View>
    </Pressable>
  );
}
