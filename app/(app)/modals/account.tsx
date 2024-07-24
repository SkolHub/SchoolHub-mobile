import { ScrollView, Text, useColorScheme, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAccount } from '@/data/accounts';
import { router } from 'expo-router';
import Caption from '@/components/caption';
import { useGlobalView } from '@/data/global-view';
import List from '@/components/list';
import ListItem from '@/components/list-item';
import tw from '@/lib/tailwind';
import {
  useGetAccount,
  useGetAccountID,
  useGetAccountRole
} from '@/api/account';
import LoadingView from '@/components/loading-view';
import { useSession } from '@/context/AuthContext';
import ErrorView from '@/components/error-view';
import { useEffect, useState } from 'react';
import * as SecureStorage from 'expo-secure-store';
import { useQueryClient } from '@tanstack/react-query';

export default function Account() {
  const colorScheme = useColorScheme();
  const { loggedIn, setLoggedIn } = useAccount();
  const { view, setView } = useGlobalView();

  const account = useGetAccount();
  const { signOut } = useSession();

  const { session } = useSession();

  const role = useGetAccountRole();
  const userID = useGetAccountID();

  const queryClient = useQueryClient();

  if (account.isPending) {
    return <LoadingView />;
  }

  if (account.isError) {
    return (
      <ErrorView
        refetch={account.refetch}
        // @ts-ignore
        error={account.error.response?.data?.message + ' ' + session}
      />
    );
  }

  return (
    <ScrollView
      style={tw`bg-secondary-100 dark:bg-primary-950`}
      contentContainerStyle={tw`px-4 py-6`}
    >
      <View style={tw`items-center justify-center`}>
        <Ionicons
          name='person-circle-outline'
          size={120}
          color={
            colorScheme === 'light'
              ? tw.color('primary-800')
              : tw.color('primary-200')
          }
        />
        <Text
          style={tw`pt-2 text-3xl font-bold text-primary-800 dark:text-primary-50`}
        >
          {account.data?.name}
        </Text>
        <Text
          style={tw`text-base font-semibold text-primary-800 dark:text-primary-300`}
        >
          {account.data.user}
        </Text>
        <Text
          style={tw`text-base font-semibold text-primary-800 dark:text-primary-300`}
        >
          {userID.data}
        </Text>
        <Text
          style={tw`text-base font-semibold text-primary-800 dark:text-primary-300`}
        >
          {account.data.role}
        </Text>
      </View>
      <Caption text='Account' />
      <List>
        <ListItem text='Change password' onPress={() => {}} />
        <ListItem
          text='Log out'
          textStyle='text-red-500 dark:text-red-500'
          onPress={async () => {
            queryClient.clear();
            await queryClient.resetQueries();
            // await queryClient.invalidateQueries();

            signOut();
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
                    ? tw.color('primary-800')
                    : tw.color('primary-100')
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
                    ? tw.color('primary-800')
                    : tw.color('primary-100')
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
                    ? tw.color('primary-800')
                    : tw.color('primary-100')
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
