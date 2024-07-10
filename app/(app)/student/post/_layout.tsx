import { router, Stack } from 'expo-router';
import GenericHeader from '@/components/generic-header';
import React from 'react';

export default function Layout() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Stack>
        <Stack.Screen
          name={'announcement'}
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
          name={'assignment'}
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
          name={'material'}
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
          name={'test'}
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
      </Stack>
    </>
  );
}
