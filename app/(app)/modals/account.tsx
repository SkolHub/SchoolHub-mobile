import {
  Pressable,
  ScrollView,
  Text,
  useColorScheme,
  View
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAccount } from '@/data/accounts';
import { router } from 'expo-router';
import Caption from '@/components/caption';
import { useGlobalView } from '@/data/global-view';
import List from '@/components/list';
import ListItem from '@/components/list-item';
import tw from '@/lib/tailwind';

export default function Account() {
  const colorScheme = useColorScheme();
  const { loggedIn, setLoggedIn } = useAccount();
  const { view, setView } = useGlobalView();

  return (
    <ScrollView
      style={tw`bg-secondary-blue-100 dark:bg-primary-blue-950`}
      contentContainerStyle={tw`px-4 py-6`}
    >
      <View style={tw`items-center justify-center`}>
        <Ionicons
          name='person-circle-outline'
          size={120}
          color={
            colorScheme === 'light'
              ? tw.color('primary-blue-800')
              : tw.color('primary-blue-200')
          }
        />
        <Text
          style={tw`pt-2 text-3xl font-bold text-primary-blue-800 dark:text-primary-blue-50`}
        >
          {loggedIn?.name + ' ' + loggedIn?.surname}
        </Text>
        <Text
          style={tw`text-base font-semibold text-primary-blue-800 dark:text-primary-blue-300`}
        >
          {loggedIn?.email}
        </Text>
      </View>
      <Caption text='Account' />
      <List>
        <ListItem text='Change password' onPress={() => {}} />
        <ListItem
          text='Log out'
          textStyle='text-red-500 dark:text-red-500'
          onPress={() => {
            setLoggedIn(null);
            router.push('/');
          }}
        />
      </List>
      <Caption text='View' />
      <List>
        <ListItem
          text='Student'
          onPress={() => setView('student')}
          rightComponent={
            view === 'student' ? (
              <Ionicons
                name='checkmark-outline'
                size={20}
                color={
                  colorScheme === 'light'
                    ? tw.color('primary-blue-800')
                    : tw.color('primary-blue-100')
                }
              />
            ) : (
              <></>
            )
          }
        />
        <ListItem
          text='Teacher'
          onPress={() => setView('teacher')}
          rightComponent={
            view === 'teacher' ? (
              <Ionicons
                name='checkmark-outline'
                size={20}
                color={
                  colorScheme === 'light'
                    ? tw.color('primary-blue-800')
                    : tw.color('primary-blue-100')
                }
              />
            ) : (
              <></>
            )
          }
        />
        <ListItem
          text='Parent'
          onPress={() => setView('parent')}
          rightComponent={
            view === 'parent' ? (
              <Ionicons
                name='checkmark-outline'
                size={20}
                color={
                  colorScheme === 'light'
                    ? tw.color('primary-blue-800')
                    : tw.color('primary-blue-100')
                }
              />
            ) : (
              <></>
            )
          }
        />
      </List>

      <List style={tw`mt-8`}>
        <ListItem
          text='Developer'
          onPress={() => {
            router.push('/modals/developer');
          }}
        />
      </List>
    </ScrollView>
  );
}
