import { Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Icons } from '@/lib/icons';
import tw from '@/lib/tailwind';

export default function SubjectCard({
  name,
  icon,
  secondaryText,
  onPress
}: {
  name: string;
  icon: string;
  secondaryText: string;
  onPress: () => void;
}) {
  return (
    <View style={tw`overflow-hidden rounded-3xl`}>
      <Pressable
        onPress={onPress}
        android_ripple={{
          color: 'rgba(255, 255, 255)',
          borderless: true,
          radius: 500,
          foreground: false
        }}
        style={({ pressed }) =>
          tw.style(
            `flex-row rounded-3xl bg-neutral-50 px-4 py-3 active:opacity-80 dark:bg-neutral-700/80`,
            pressed && `ios:opacity-70`
          )
        }
      >
        <Image
          contentFit='contain'
          source={Icons.find((i) => i.name === icon)?.icon ?? Icons[0].icon}
          style={{ width: 32, height: 50 }}
        />
        <View style={tw`justify-center px-4`}>
          <Text
            style={tw`text-lg font-bold leading-tight text-primary-800 dark:text-neutral-200`}
          >
            {name}
          </Text>
          <Text
            style={tw`text-base font-semibold leading-tight text-primary-700 dark:text-neutral-200`}
          >
            {secondaryText}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}
