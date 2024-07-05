import { Stack, Tabs, useLocalSearchParams, useNavigation } from 'expo-router';
import { useOrganizations } from '@/data/organizations';
import SubjectHeader from '@/components/subject-header';
import Ionicons from '@expo/vector-icons/Ionicons';
import tw from '@/lib/tailwind';
import { useColorScheme } from 'react-native';

export default function SubjectLayout() {
  const { subject, className } = useLocalSearchParams();
  const { activeOrganization } = useOrganizations();
  const { getSubject } = useOrganizations();

  const navigation = useNavigation();

  const colorScheme = useColorScheme();

  const subjectData = getSubject(
    activeOrganization,
    className as string,
    subject as string
  );

  // useEffect(() => {
  //   handleThemeSwitch(subjectData.theme);
  // }, []);

  const theme = subjectData.theme;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Tabs
        screenOptions={{
          tabBarStyle: tw`bg-secondary-${theme}-50 dark:bg-primary-${theme}-950 elevation-0 border-t-0 android:h-[70px] android:pb-[15px]`
        }}
      >
        <Tabs.Screen
          name='index'
          options={{
            tabBarLabel: 'Stream',
            tabBarLabelStyle: {
              color:
                colorScheme === 'light'
                  ? tw.color(`primary-${theme}-800`)
                  : tw.color(`primary-${theme}-200`)
            },
            tabBarIcon: ({ focused }) => {
              const color =
                colorScheme === 'light'
                  ? tw.color(`primary-${theme}-800`)
                  : tw.color(`primary-${theme}-300`);
              if (focused) {
                return <Ionicons name='home' size={24} color={color} />;
              }
              return <Ionicons name='home-outline' size={24} color={color} />;
            },
            header: () => (
              <SubjectHeader
                text={subjectData.name}
                icon={subjectData.icon}
                onPress={() => {
                  navigation.goBack();
                }}
                theme={theme}
              />
            )
          }}
        />
        <Tabs.Screen
          name='grades'
          options={{
            tabBarLabel: 'Grades',
            tabBarLabelStyle: {
              color:
                colorScheme === 'light'
                  ? tw.color(`primary-${theme}-800`)
                  : tw.color(`primary-${theme}-200`)
            },
            tabBarIcon: ({ focused }) => {
              const color =
                colorScheme === 'light'
                  ? tw.color(`primary-${theme}-800`)
                  : tw.color(`primary-${theme}-300`);
              if (focused) {
                return <Ionicons name='stats-chart' size={24} color={color} />;
              }
              return (
                <Ionicons name='stats-chart-outline' size={24} color={color} />
              );
            },
            header: () => (
              <SubjectHeader
                text={subjectData.name}
                icon={subjectData.icon}
                onPress={() => {
                  navigation.goBack();
                }}
                theme={theme}
              />
            )
          }}
        />
        <Tabs.Screen
          name='absences'
          options={{
            tabBarLabel: 'Absences',
            tabBarLabelStyle: {
              color:
                colorScheme === 'light'
                  ? tw.color(`primary-${theme}-800`)
                  : tw.color(`primary-${theme}-200`)
            },
            tabBarIcon: ({ focused }) => {
              const color =
                colorScheme === 'light'
                  ? tw.color(`primary-${theme}-800`)
                  : tw.color(`primary-${theme}-300`);
              if (focused) {
                return <Ionicons name='calendar' size={24} color={color} />;
              }
              return (
                <Ionicons name='calendar-outline' size={24} color={color} />
              );
            },
            header: () => (
              <SubjectHeader
                text={subjectData.name}
                icon={subjectData.icon}
                onPress={() => {
                  navigation.goBack();
                }}
                theme={theme}
              />
            )
          }}
        />
      </Tabs>
    </>
  );
}
