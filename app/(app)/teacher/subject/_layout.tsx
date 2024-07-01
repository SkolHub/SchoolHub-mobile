import { Stack, Tabs, useLocalSearchParams, useNavigation } from 'expo-router';
import { useOrganizations } from '@/data/organizations';
import SubjectHeader from '@/components/subject-header';
import { Text, useColorScheme } from 'react-native';
import tw from '@/lib/tailwind';
import { rgbaToHex } from '@/lib/utils';
import { SymbolView } from 'expo-symbols';
import { MaterialIcons } from '@expo/vector-icons';

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

  const theme = subjectData?.theme || 'blue';

  // useEffect(() => {
  //   handleThemeSwitch(subjectData.theme);
  // }, []);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor:
              colorScheme === 'light'
                ? tw.color(`secondary-${theme}-50`)
                : tw.color(`primary-${theme}-950`),
            elevation: 0,
            borderTopColor:
              colorScheme === 'light'
                ? tw.color(`secondary-${theme}-50`)
                : tw.color(`primary-${theme}-950`)
          }
        }}
      >
        <Tabs.Screen
          name='index'
          options={{
            tabBarLabel: ({ focused }) => {
              return (
                <Text
                  style={tw`text-primary-${theme}-800${focused ? '' : '/60'} dark:text-primary-${theme}-200${focused ? '' : '/60'} text-[10.5px] leading-tight`}
                >
                  Stream
                </Text>
              );
            },
            tabBarIcon: ({ focused }) => {
              let color =
                colorScheme === 'light'
                  ? `primary-${theme}-800`
                  : `primary-${theme}-300`;

              if (!focused) {
                color += '/50';
                color = rgbaToHex(tw.color(color) as string);
              } else {
                color = tw.color(color) as string;
              }

              return (
                <SymbolView
                  name='house.fill'
                  tintColor={color}
                  fallback={
                    <MaterialIcons name='home' size={24} color={color} />
                  }
                />
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
          name='grades'
          options={{
            tabBarLabel: ({ focused }) => {
              return (
                <Text
                  style={tw`text-primary-${theme}-800${focused ? '' : '/60'} dark:text-primary-${theme}-200${focused ? '' : '/60'} text-[10.5px] leading-tight`}
                >
                  Grades
                </Text>
              );
            },
            tabBarIcon: ({ focused }) => {
              let color =
                colorScheme === 'light'
                  ? `primary-${theme}-800`
                  : `primary-${theme}-300`;

              if (!focused) {
                color += '/50';
                color = rgbaToHex(tw.color(color) as string);
              } else {
                color = tw.color(color) as string;
              }

              return (
                <SymbolView
                  name='chart.bar.fill'
                  tintColor={color}
                  fallback={
                    <MaterialIcons name='bar-chart' size={24} color={color} />
                  }
                />
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
            tabBarLabel: ({ focused }) => {
              return (
                <Text
                  style={tw`text-primary-${theme}-800${focused ? '' : '/60'} dark:text-primary-${theme}-200${focused ? '' : '/60'} text-[10.5px] leading-tight`}
                >
                  Absences
                </Text>
              );
            },
            tabBarIcon: ({ focused }) => {
              let color =
                colorScheme === 'light'
                  ? `primary-${theme}-800`
                  : `primary-${theme}-300`;

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
