import { router, Stack } from 'expo-router';
import HomeHeader from '@/components/home-header';

export default function Layout() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Stack>
        <Stack.Screen
          name={'index'}
          options={{
            header: () => {
              return (
                <HomeHeader
                  text='Subjects'
                  onPress={() => {
                    router.push('/modals/account');
                  }}
                />
              );
            }
          }}
        />
      </Stack>
    </>
  );
}
