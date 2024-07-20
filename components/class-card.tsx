import { Subject } from '@/api/subject';
import { Pressable, Text, View } from 'react-native';
import tw from '@/lib/tailwind';
import { Image } from 'expo-image';
import { Icons } from '@/lib/icons';
import { androidRipple } from '@/lib/utils';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ClassCard({
  name,
  subjects,
  classMaster
}: {
  name: string;
  subjects: Subject[];
  classMaster: boolean;
}) {
  return (
    <View style={tw`rounded-3xl bg-neutral-50 p-4 dark:bg-neutral-700/80`}>
      <View style={tw`flex-row items-center justify-between pb-2`}>
        <Text
          style={tw`text-lg font-semibold leading-tight text-primary-700 dark:text-neutral-200`}
        >
          {name}
        </Text>
        {classMaster && (
          <View style={tw`flex-row items-center gap-1`}>
            <Ionicons
              name={'people'}
              size={24}
              color={
                tw.prefixMatch('dark')
                  ? tw.color('primary-300')
                  : tw.color('primary-600')
              }
            />
            <Text
              style={tw`text-base font-semibold leading-tight text-primary-600 dark:text-primary-300`}
            >
              Class Master
            </Text>
          </View>
        )}
      </View>
      <View style={tw`gap-2`}>
        {subjects.map((subject) => (
          <View style={tw`overflow-hidden rounded-2xl`} key={subject.id}>
            <Pressable
              android_ripple={androidRipple}
              style={({ pressed }) =>
                tw.style(
                  `flex-row items-center gap-2 rounded-2xl bg-neutral-200/80 p-2 dark:bg-neutral-600`,
                  pressed && `ios:opacity-80`
                )
              }
              onPress={() => {
                router.push({
                  pathname: '/teacher/subject',
                  params: {
                    subjectID: subject.id
                  }
                });
              }}
            >
              <Image
                contentFit='contain'
                source={
                  Icons.find((i) => i.name === subject.icon)?.icon ??
                  Icons[0].icon
                }
                style={{ width: 28, height: 28 }}
              />
              <Text
                style={tw`text-base font-semibold leading-tight text-primary-800 dark:text-neutral-100`}
              >
                {subject.name}
              </Text>
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
}
