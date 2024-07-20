import { Stack, Tabs, useLocalSearchParams, useNavigation } from 'expo-router';
import SubjectHeader from '@/components/subject-header';
import { Text } from 'react-native';
import tw from '@/lib/tailwind';
import { rgbaToHex } from '@/lib/utils';
import { SymbolView } from 'expo-symbols';
import { MaterialIcons } from '@expo/vector-icons';
import { TeacherClass, useGetTeacherSubjects } from '@/api/subject';
import React from 'react';
import LoadingView from '@/components/loading-view';
import ErrorView from '@/components/error-view';

function findSubject(classes: TeacherClass[], subjectID: string) {
  for (const class_ of classes) {
    for (const subject of class_.subjects) {
      if (subject.id == subjectID) {
        return {
          ...subject,
          className: class_.schoolClasses.map((c) => c.name).join(', ')
        };
      }
    }
  }

  return {
    name: 'Error',
    icon: 'book',
    className: 'Error'
  };
}

export default function SubjectLayout() {
  const colorScheme = tw.prefixMatch('dark') ? 'dark' : 'light';
  const navigation = useNavigation();

  const { subjectID } = useLocalSearchParams();
  const subjects = useGetTeacherSubjects();

  if (subjects.isPending) {
    return <LoadingView />;
  }

  if (subjects.isError) {
    return (
      <ErrorView refetch={subjects.refetch} error={subjects.error.message} />
    );
  }

  const subjectData = findSubject(subjects.data, subjectID as string);

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
            title: 'Stream',
            tabBarLabel: ({ focused }) => {
              return (
                <Text
                  style={tw`text-primary-800${focused ? '' : '/60'} dark:text-primary-200${focused ? '' : '/60'} text-[10.5px] leading-tight`}
                >
                  Stream
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
                  text={subjectData.className}
                  secondaryText={subjectData.name}
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
          name='students'
          options={{
            title: 'Students',
            tabBarLabel: ({ focused }) => {
              return (
                <Text
                  style={tw`text-primary-800${focused ? '' : '/60'} dark:text-primary-200${focused ? '' : '/60'} text-[10.5px] leading-tight`}
                >
                  Students
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
                  name='person.2.fill'
                  tintColor={color}
                  resizeMode={'scaleAspectFill'}
                  fallback={
                    <MaterialIcons name='home' size={24} color={color} />
                  }
                />
              );
            },
            header: () => {
              return (
                <SubjectHeader
                  text={subjectData.className}
                  secondaryText={subjectData.name}
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
