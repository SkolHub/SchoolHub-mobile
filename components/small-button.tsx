import { Pressable, Text, View } from 'react-native';
import tw from '@/lib/tailwind';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function SmallButton({
  text,
  onPress,
  iconName,
  style,
  textStyle,
  contentContainerStyle
}: {
  text: string;
  onPress: () => void;
  iconName?: string;
  style?: string;
  textStyle?: string;
  contentContainerStyle?: string;
}) {
  return (
    <View style={tw`overflow-hidden rounded-full`}>
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
            `flex-row items-center justify-center rounded-[16.5] bg-neutral-50 px-3 py-3 dark:bg-neutral-700`,
            text && 'px-5',
            contentContainerStyle
          )}
        >
          {iconName && (
            <Ionicons
              name={iconName as any}
              size={22}
              color={
                tw.prefixMatch('dark')
                  ? tw.color(`primary-200`)
                  : tw.color(`primary-800`)
              }
              style={tw.style(text ? `mr-2` : ``)}
            />
          )}
          <Text
            style={tw.style(
              `text-base font-semibold text-primary-800 dark:text-primary-50`,
              textStyle
            )}
          >
            {text}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}
