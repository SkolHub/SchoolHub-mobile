import { router, Stack } from 'expo-router';
import ModalHeader from '@/components/modal-header';

export default function ModalsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name='attendance-mode'
        options={{
          presentation: 'modal',
          header: () => (
            <ModalHeader
              text='Attendance mode'
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
              text='Grade the class'
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
              text='Post a new material'
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
              text='Plan a new test'
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
              text='Create a new announcement'
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
