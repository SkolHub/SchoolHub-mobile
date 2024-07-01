import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import Toast, { ToastConfig } from 'react-native-toast-message';
import { Text, View } from 'react-native';
import { SessionProvider } from '@/context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDeviceContext } from 'twrnc';
import tw from '@/lib/tailwind';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf')
  });

  const queryClient = new QueryClient();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

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

  if (!loaded) {
    return null;
  }

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
