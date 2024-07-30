import { Pressable, Text, View } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import tw from '@/lib/tailwind';
import { Theme } from '@/lib/types';
import { SymbolView } from 'expo-symbols';
import { SFSymbols5_0 } from 'sf-symbols-typescript';

export default function LargeButton({
  text,
  style,
  contentContainerStyle,
  textStyle,
  onPress,
  iconName,
  iconColor = 'white',
  theme = 'blue',
  symbol
}: {
  text: string;
  textStyle?: string;
  style?: string;
  contentContainerStyle?: string;
  onPress: () => void;
  iconName?: string;
  iconColor?: string;
  theme?: Theme;
  symbol?: {
    name: SFSymbols5_0;
    fallback: string;
  };
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
          `h-12 w-full flex-row items-center justify-center rounded-[16.5] bg-primary-600`,
          contentContainerStyle
        )}
      >
        {symbol && (
          <SymbolView
            name={symbol.name}
            fallback={
              <MaterialIcons
                name={symbol.fallback as any}
                size={28}
                color={iconColor}
                style={tw.style(text ? `mr-2` : ``, textStyle)}
              />
            }
            size={24}
            resizeMode={'scaleAspectFill'}
            tintColor={tw.color('primary-50')}
            style={tw.style(text ? `mr-2` : ``, textStyle)}
          />
        )}
        {iconName && (
          <Ionicons
            name={iconName as any}
            size={28}
            color={iconColor}
            style={tw.style(text ? `mr-2` : ``, textStyle)}
          />
        )}
        <Text
          style={tw.style(`text-base font-semibold text-primary-50`, textStyle)}
        >
          {text}
        </Text>
      </View>
    </Pressable>
  );
}
