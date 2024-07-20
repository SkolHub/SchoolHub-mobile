import { router, Stack } from 'expo-router';
import GenericHeader from '@/components/generic-header';
import React from 'react';

export default function Layout() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Stack>
        <Stack.Screen
          name={'index'}
          options={{
            header: () => (
              <GenericHeader
                text=''
                onPress={() => {
                  router.back();
                }}
              />
            )
          }}
        />
        <Stack.Screen
          name={'submissions'}
          options={{
            header: () => (
              <GenericHeader
                text='Student submissions'
                onPress={() => {
                  router.back();
                }}
              />
            )
          }}
        />
      </Stack>
    </>
  );
}
