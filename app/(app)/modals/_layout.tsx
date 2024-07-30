import { router, Stack } from 'expo-router';
import ModalHeader from '@/components/modal-header';
import { StatusBar } from 'expo-status-bar';
import { t } from '@lingui/macro';

export default function ModalsLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen
          name='attendance-mode'
          options={{
            presentation: 'modal',
            header: () => (
              <ModalHeader
                text={t`Attendance mode`}
                onPress={() => {
                  router.back();
                }}
              />
            )
          }}
        />
        <Stack.Screen
          name='grade-mode'
          options={{
            presentation: 'modal',
            header: () => (
              <ModalHeader
                text={t`Grade the class`}
                onPress={() => {
                  router.back();
                }}
              />
            )
          }}
        />
        <Stack.Screen
          name='student-classbook'
          options={{
            presentation: 'modal',
            header: () => (
              <ModalHeader
                text=''
                onPress={() => {
                  router.back();
                }}
              />
            )
          }}
        />
        <Stack.Screen
          name='classbook-subject'
          options={{
            presentation: 'modal',
            header: () => (
              <ModalHeader
                text=''
                onPress={() => {
                  router.back();
                }}
              />
            )
          }}
        />
        <Stack.Screen
          name='create-material'
          options={{
            presentation: 'modal',
            header: () => (
              <ModalHeader
                text={t`Post a new material`}
                onPress={() => {
                  router.back();
                }}
              />
            )
          }}
        />
        <Stack.Screen
          name='create-test'
          options={{
            presentation: 'modal',
            header: () => (
              <ModalHeader
                text={t`Plan a new test`}
                onPress={() => {
                  router.back();
                }}
              />
            )
          }}
        />
        <Stack.Screen
          name='create-announcement'
          options={{
            presentation: 'modal',
            header: () => (
              <ModalHeader
                text={t`Create a new announcement`}
                onPress={() => {
                  router.back();
                }}
              />
            )
          }}
        />
        <Stack.Screen
          name='create-assignment'
          options={{
            presentation: 'modal',
            header: () => (
              <ModalHeader
                text={t`Create Assignment`}
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
                text={t`File`}
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
                text={t`Account`}
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
                text={t`Assessment`}
                onPress={() => {
                  router.back();
                }}
              />
            )
          }}
        />
      </Stack>
      <StatusBar style={'light'} animated={true} />
    </>
  );
}
