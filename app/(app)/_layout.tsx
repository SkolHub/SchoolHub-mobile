import { useSession } from '@/context/AuthContext';
import { Redirect, Slot, Stack } from 'expo-router';
import LoadingView from '@/components/loading-view';
import { useAccount } from '@/data/accounts';

export default function AppLayout() {
  const { session, isLoading } = useSession();
  const { loggedIn } = useAccount();

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <LoadingView />;
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!loggedIn) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href='/login' />;
  }

  return (
    <Stack>
      <Stack.Screen
        name='modals'
        options={{ presentation: 'modal', headerShown: false }}
      />
      <Stack.Screen
        name='parent/(home)'
        options={{ headerShown: false, animation: 'none' }}
      />
      <Stack.Screen
        name='student/(home)'
        options={{ headerShown: false, animation: 'none' }}
      />
      <Stack.Screen name='index' options={{ headerShown: false }} />
    </Stack>
  );
}
