import { ScrollView, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import Caption from '@/components/caption';
import List from '@/components/list';
import ListItem from '@/components/list-item';
import tw from '@/lib/tailwind';
import { useGetAccount } from '@/api/account';
import LoadingView from '@/components/loading-view';
import { useSession } from '@/context/AuthContext';
import ErrorView from '@/components/error-view';
import { useQueryClient } from '@tanstack/react-query';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import * as DropdownMenu from 'zeego/dropdown-menu';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Languages, LanguagesList } from '@/lib/languages';
import RNRestart from 'react-native-restart';

export default function Account() {
  const account = useGetAccount();
  const { signOut } = useSession();
  const queryClient = useQueryClient();
  const { i18n } = useLingui();

  if (account.isPending) {
    return <LoadingView />;
  }

  if (account.isError) {
    return (
      <ErrorView refetch={account.refetch} error={account.error.message} />
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
            tw.prefixMatch('dark')
              ? tw.color('primary-200')
              : tw.color('primary-800')
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
      </View>
      <Caption text={t`Account`} />
      <List>
        <ListItem text={t`Change password`} onPress={() => {}} />
        <ListItem
          text={t`Log out`}
          textStyle='text-red-500 dark:text-red-500'
          onPress={async () => {
            queryClient.clear();
            await queryClient.resetQueries();
            signOut();
            router.push('/');
          }}
        />
      </List>

      <Caption text={t`Language`} />
      <List>
        <ListItem
          text={t`Language`}
          shouldPress={false}
          rightComponent={
            <DropdownMenu.Root style={{ width: 100 }}>
              <DropdownMenu.Trigger
                style={{ width: 100, alignItems: 'flex-end' }}
              >
                <View style={tw`flex-row items-center justify-end gap-1`}>
                  <Text
                    style={tw`text-base font-semibold text-primary-800 dark:text-primary-300`}
                  >
                    {
                      LanguagesList.find((lang) => lang.code === i18n.locale)
                        ?.native
                    }
                  </Text>
                  <Ionicons
                    name='chevron-expand'
                    size={20}
                    color={
                      tw.prefixMatch('dark')
                        ? tw.color('primary-300')
                        : tw.color('primary-800')
                    }
                  />
                </View>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Group>
                  {LanguagesList.map((lang) => (
                    <DropdownMenu.CheckboxItem
                      value={i18n.locale === lang.code ? 'on' : 'off'}
                      key={lang.code}
                      onValueChange={async (state) => {
                        if (state === 'on') {
                          i18n.load(
                            lang.code,
                            Languages[lang.code as keyof typeof Languages]
                          );
                          i18n.activate(lang.code);
                          try {
                            await AsyncStorage.setItem('language', lang.code);
                            RNRestart.restart();
                          } catch (e) {
                            console.error(e);
                          }
                        }
                      }}
                    >
                      <DropdownMenu.ItemIndicator />
                      <DropdownMenu.ItemTitle
                        children={`${lang.native} ${lang.code !== 'en' ? '(' + lang.english + ')' : ''}`}
                      />
                    </DropdownMenu.CheckboxItem>
                  ))}
                </DropdownMenu.Group>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          }
        />
      </List>
    </ScrollView>
  );
}
