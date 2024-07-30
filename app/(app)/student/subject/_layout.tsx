import { Stack, Tabs, useLocalSearchParams, useNavigation } from 'expo-router';
import SubjectHeader from '@/components/subject-header';
import tw from '@/lib/tailwind';
import { Class, Teacher, useGetStudentSubjects } from '@/api/subject';
import LoadingView from '@/components/loading-view';
import ErrorView from '@/components/error-view';
import { Text } from 'react-native';
import { rgbaToHex } from '@/lib/utils';
import { SymbolView } from 'expo-symbols';
import { MaterialIcons } from '@expo/vector-icons';
import { t, Trans } from '@lingui/macro';

function findSubject(
  classes: Class[],
  subjectID: string
): {
  name: string;
  icon: string;
  teachers: Teacher[] | null;
} {
  for (const class_ of classes) {
    for (const subject of class_.subjects) {
      if (subject.id == subjectID) {
        return subject;
      }
    }
  }

  return {
    name: t`Error`,
    icon: 'book',
    teachers: []
  };
}

export default function SubjectLayout() {
  const navigation = useNavigation();
  const colorScheme = tw.prefixMatch('dark') ? 'dark' : 'light';

  const { subjectID } = useLocalSearchParams();

  const { data, isError, error, isPending, refetch } = useGetStudentSubjects();

  if (isPending) {
    return <LoadingView />;
  }

  if (isError) {
    return (
      <ErrorView
        refetch={refetch}
        // @ts-ignore
        error={error.response?.data?.message + ' ' + session}
      />
    );
  }

  const subjectData = findSubject(data, subjectID as string);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Tabs
        screenOptions={{
          tabBarStyle: tw`bg-secondary-100 dark:bg-primary-950 elevation-0 border-t-0 android:h-[70px] android:pb-[15px]`
        }}
      >
        <Tabs.Screen
          name='index'
          options={{
            title: t`Stream`,
            tabBarLabel: ({ focused }) => {
              return (
                <Text
                  style={tw`text-primary-800${focused ? '' : '/60'} dark:text-primary-200${focused ? '' : '/60'} text-[10.5px] leading-tight`}
                >
                  <Trans>Stream</Trans>
                </Text>
              );
            },
            tabBarIcon: ({ focused }) => {
              let color =
                colorScheme === 'light' ? 'primary-800' : 'primary-300';

              if (!focused) {
                color += '/50';
                color = rgbaToHex(tw.color(color) as string);
              } else {
                color = tw.color(color) as string;
              }

              // console.log(focused);

              return (
                <SymbolView
                  name='house.fill'
                  size={22}
                  resizeMode={'scaleAspectFill'}
                  tintColor={color}
                  fallback={
                    <MaterialIcons name='home' size={24} color={color} />
                  }
                />
              );
            },
            header: () => {
              return (
                <SubjectHeader
                  text={subjectData.name}
                  secondaryText={
                    subjectData.teachers?.map((t) => t.name).join(', ') ?? ''
                  }
                  icon={subjectData.icon}
                  onPress={() => {
                    navigation.goBack();
                  }}
                />
              );
            }
          }}
        />
        <Tabs.Screen
          name='grades'
          options={{
            title: t`Grades`,
            tabBarLabel: ({ focused }) => {
              return (
                <Text
                  style={tw`text-primary-800${focused ? '' : '/60'} dark:text-primary-200${focused ? '' : '/60'} text-[10.5px] leading-tight`}
                >
                  <Trans>Grades</Trans>
                </Text>
              );
            },
            tabBarIcon: ({ focused }) => {
              let color =
                colorScheme === 'light' ? 'primary-800' : 'primary-300';

              if (!focused) {
                color += '/50';
                color = rgbaToHex(tw.color(color) as string);
              } else {
                color = tw.color(color) as string;
              }

              return (
                <SymbolView
                  name='chart.bar.fill'
                  size={22}
                  resizeMode={'scaleAspectFill'}
                  tintColor={color}
                  fallback={
                    <MaterialIcons name='bar-chart' size={30} color={color} />
                  }
                />
              );
            },
            header: () => {
              return (
                <SubjectHeader
                  text={subjectData.name}
                  icon={subjectData.icon}
                  onPress={() => {
                    navigation.goBack();
                  }}
                />
              );
            }
          }}
        />
        <Tabs.Screen
          name='absences'
          options={{
            title: t`Attendance`,
            tabBarLabel: ({ focused }) => {
              return (
                <Text
                  style={tw`text-primary-800${focused ? '' : '/60'} dark:text-primary-200${focused ? '' : '/60'} text-[10.5px] leading-tight`}
                >
                  <Trans>Attendance</Trans>
                </Text>
              );
            },
            tabBarIcon: ({ focused }) => {
              let color =
                colorScheme === 'light' ? 'primary-800' : 'primary-300';

              if (!focused) {
                color += '/50';
                color = rgbaToHex(tw.color(color) as string);
              } else {
                color = tw.color(color) as string;
              }

              return (
                <SymbolView
                  name='calendar'
                  tintColor={color}
                  size={22}
                  resizeMode={'scaleAspectFill'}
                  fallback={
                    <MaterialIcons
                      name='calendar-month'
                      size={24}
                      color={color}
                    />
                  }
                />
              );
            },
            header: () => {
              return (
                <SubjectHeader
                  text={subjectData.name}
                  icon={subjectData.icon}
                  onPress={() => {
                    navigation.goBack();
                  }}
                />
              );
            }
          }}
        />
      </Tabs>
    </>
  );
}
