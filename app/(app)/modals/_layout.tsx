import { router, Stack } from 'expo-router';
import ModalHeader from '@/components/modal-header';

export default function ModalsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name='create-assignment'
        options={{
          presentation: 'modal',
          header: () => (
            <ModalHeader
              text='Create Assignment'
              onPress={() => {
                router.back();
              }}
            />
          )
        }}
      />
      <Stack.Screen
        name='file-view'
        options={{
          presentation: 'modal',
          header: () => (
            <ModalHeader
              text='File'
              onPress={() => {
                router.back();
              }}
            />
          )
        }}
      />
      <Stack.Screen
        name='account'
        options={{
          presentation: 'modal',
          header: () => (
            <ModalHeader
              text='Account'
              onPress={() => {
                router.back();
              }}
            />
          )
        }}
      />
      <Stack.Screen
        name='assessment'
        options={{
          presentation: 'modal',
          header: () => (
            <ModalHeader
              text='Assessment'
              onPress={() => {
                router.back();
              }}
            />
          )
        }}
      />
    </Stack>
  );
}
