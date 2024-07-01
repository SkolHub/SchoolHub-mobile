import { router, Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import HomeHeader from '@/components/home-header';
import { useColorScheme } from 'react-native';
import tw from '@/lib/tailwind';

export default function HomeLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor:
            colorScheme === 'light'
              ? tw.color('secondary-blue-100')
              : tw.color('primary-blue-950'),
          elevation: 0,
          borderTopColor:
            colorScheme === 'light'
              ? tw.color('secondary-blue-100')
              : tw.color('primary-blue-950')
        }
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Grades',
          tabBarLabel: 'Grades',
          tabBarLabelStyle: {
            color:
              colorScheme === 'light'
                ? tw.color('primary-blue-800')
                : tw.color('primary-blue-200')
          },
          tabBarIcon: ({ focused }) => {
            const color =
              colorScheme === 'light'
                ? tw.color('primary-blue-800')
                : tw.color('primary-blue-300');
            if (focused) {
              return <Ionicons name='book' size={24} color={color} />;
            }
            return <Ionicons name='book-outline' size={24} color={color} />;
          },
          header: () => {
            return (
              <HomeHeader
                text='Grades'
                onPress={() => {
                  router.push('/modals/account');
                }}
              />
            );
          }
        }}
      />
      <Tabs.Screen
        name='attendance'
        options={{
          title: 'Attendance',
          tabBarLabel: 'Attendance',
          tabBarLabelStyle: {
            color:
              colorScheme === 'light'
                ? tw.color('primary-blue-800')
                : tw.color('primary-blue-200')
          },
          tabBarIcon: ({ focused }) => {
            const color =
              colorScheme === 'light'
                ? tw.color('primary-blue-800')
                : tw.color('primary-blue-300');
            if (focused) {
              return <Ionicons name='calendar' size={24} color={color} />;
            }
            return <Ionicons name='calendar-outline' size={24} color={color} />;
          },
          header: () => {
            return (
              <HomeHeader
                text='Attendance'
                onPress={() => {
                  router.push('/modals/account');
                }}
              />
            );
          }
        }}
      />
    </Tabs>
  );
}
