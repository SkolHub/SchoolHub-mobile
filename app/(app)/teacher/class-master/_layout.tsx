import { router, Stack } from 'expo-router';
import GenericHeader from '@/components/generic-header';

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
                text={''}
                onPress={() => {
                  router.back();
                }}
              />
            )
          }}
        />
        <Stack.Screen
          name={'student'}
          options={{
            header: () => (
              <GenericHeader
                text={''}
                onPress={() => {
                  router.back();
                }}
              />
            )
          }}
        />
        <Stack.Screen
          name={'student-classbook'}
          options={{
            header: () => (
              <GenericHeader
                text={''}
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
