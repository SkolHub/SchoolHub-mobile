import { router, Stack } from 'expo-router';
import GenericHeader from '@/components/generic-header';
import React from 'react';
import ModalHeader from '@/components/modal-header';
import { t } from '@lingui/macro';

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
                text={t`Student submissions`}
                onPress={() => {
                  router.back();
                }}
              />
            )
          }}
        />
        <Stack.Screen
          name={'student-submission'}
          options={{
            header: () => (
              <ModalHeader
                text={t`Student submission`}
                onPress={() => {
                  router.back();
                }}
              />
            ),
            presentation: 'modal'
          }}
        />
      </Stack>
    </>
  );
}
