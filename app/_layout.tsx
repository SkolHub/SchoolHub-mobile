import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import 'react-native-reanimated';
import Toast, { ToastConfig } from 'react-native-toast-message';
import { Text, View } from 'react-native';
import { SessionProvider } from '@/context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDeviceContext } from 'twrnc';
import tw from '@/lib/tailwind';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { i18n } from '@lingui/core';
import { I18nProvider, TransRenderProps } from '@lingui/react';
import '@formatjs/intl-locale/polyfill';

import '@formatjs/intl-pluralrules/polyfill';
import '@formatjs/intl-pluralrules/locale-data/en'; // locale-data for en
import '@formatjs/intl-pluralrules/locale-data/ro'; // locale-data for cs
import '@formatjs/intl-pluralrules/locale-data/hu';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Languages } from '@/lib/languages'; // locale-data for cs

const DefaultComponent = (props: TransRenderProps) => {
  return <Text>{props.children}</Text>;
};

export default function RootLayout() {
  const queryClient = new QueryClient();

  useEffect(() => {
    (async () => {
      try {
        const language = (await AsyncStorage.getItem(
          'language'
        )) as keyof typeof Languages;
        if (language !== null) {
          i18n.load(language, Languages[language]);
          i18n.activate(language);
        } else {
          i18n.load('en', require('@/locales/en/messages').messages);
          i18n.activate('en');
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  useDeviceContext(tw);

  const toastConfig: ToastConfig = {
    customToast: ({ text1, text2 }: { text1?: string; text2?: string }) => {
      return (
        <View
          style={tw`w-11/12 overflow-hidden rounded-2xl bg-white px-3 py-2 shadow-2xl`}
        >
          <Text style={tw`text-lg font-medium text-black/80`}>{text1}</Text>
          <Text style={tw`text-sm font-light text-black/40`}>{text2}</Text>
        </View>
      );
    }
  };

  // i18n.load({
  //   en: require('@/locale/en-US/messages').messages,
  //   ro: require('@/locale/ro-RO/messages').messages,
  //   hu: require('@/locale/hu-HU/messages').messages
  // });
  // i18n.activate('ro-RO');

  return (
    <I18nProvider i18n={i18n} defaultComponent={DefaultComponent}>
      <QueryClientProvider client={queryClient}>
        <ActionSheetProvider>
          <SessionProvider>
            <Stack screenOptions={{ headerShown: false }} />
            <Toast config={toastConfig} />
          </SessionProvider>
        </ActionSheetProvider>
      </QueryClientProvider>
    </I18nProvider>
  );
}
