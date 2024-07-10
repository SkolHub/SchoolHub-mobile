import { Stack } from 'expo-router';
import React from 'react';
import 'react-native-reanimated';
import Toast, { ToastConfig } from 'react-native-toast-message';
import { Text, View } from 'react-native';
import { SessionProvider } from '@/context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDeviceContext } from 'twrnc';
import tw from '@/lib/tailwind';

export default function RootLayout() {
  const queryClient = new QueryClient();

  useDeviceContext(tw);

  const toastConfig: ToastConfig = {
    customToast: ({ text1, text2 }: { text1?: string; text2?: string }) => {
      return (
        <View
          style={tw`w-11/12 overflow-hidden rounded-2xl bg-white/80 px-3 py-2`}
        >
          <Text style={tw`text-lg font-medium text-black/80`}>{text1}</Text>
          <Text style={tw`text-sm font-light text-black/40`}>{text2}</Text>
        </View>
      );
    }
  };

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <Stack screenOptions={{ headerShown: false }} />
          <Toast config={toastConfig} />
        </SessionProvider>
      </QueryClientProvider>
    </>
  );
}
