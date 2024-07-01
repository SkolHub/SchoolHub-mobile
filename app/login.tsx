import { router, Stack } from 'expo-router';
import { SafeAreaView, ScrollView, useColorScheme } from 'react-native';

import { useSession } from '@/context/AuthContext';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect } from 'react';
import FormInput from '@/components/form-input';
import LargeButton from '@/components/large-button';
import LinkButton from '@/components/link-button';
import Toast from 'react-native-toast-message';
import KeyboardAccessory from '@/components/keyboard-accessory';
import { useAccount } from '@/data/accounts';
import tw from '@/lib/tailwind';

export default function SignIn() {
  const inputAccessoryViewID = 'keyboard-accessory';

  const { addAccount, setLoggedIn, loggedIn, getAccount } = useAccount();

  const colorScheme = useColorScheme();
  const schema = yup.object({
    email: yup.string().email().required(),
    password: yup.string().required().min(8)
  });
  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: '',
      password: ''
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  });
  const onSubmit = async (data: { email: string; password: string }) => {
    const account = getAccount(data.email);
    if (account === null) {
      Toast.show({
        type: 'customToast',
        text1: "Can't sign you in!",
        text2: 'Email or password is incorrect',
        position: 'bottom'
      });
      return;
    }
    setLoggedIn(account);
  };

  useEffect(() => {
    if (loggedIn !== null) {
      router.replace('/');
    }
  }, [loggedIn]);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Sign in',
          headerLargeTitle: true,
          headerTransparent: true,
          headerTitleStyle:
            colorScheme === 'light' ? { color: '#434e61' } : { color: 'white' }
        }}
      />
      <SafeAreaView
        style={tw`flex-1 items-center justify-start bg-secondary-blue-100 dark:bg-primary-blue-950`}
      >
        <ScrollView
          style={tw`android:pt-28 flex w-full flex-1 px-4 pt-8`}
          contentContainerStyle={tw`gap-2 android:pt-20`}
        >
          <FormInput
            control={control}
            name={'email'}
            placeholder={'Email'}
            secureTextEntry={false}
            inputAccessoryViewID={inputAccessoryViewID}
            errorText={'Email is not valid'}
            contentType={'emailAddress'}
            flex1={false}
          />
          <FormInput
            control={control}
            name={'password'}
            placeholder={'Password'}
            secureTextEntry={true}
            inputAccessoryViewID={inputAccessoryViewID}
            errorText={'Password is not valid'}
            contentType={'password'}
            flex1={false}
          />
          <LargeButton
            text='Sign in'
            style='my-2'
            onPress={handleSubmit(onSubmit)}
          />
          <LinkButton
            text={`Don't have an account? Sign up`}
            onPress={() => {
              router.replace('signup');
            }}
          />
        </ScrollView>
      </SafeAreaView>
      <KeyboardAccessory inputAccessoryViewID={inputAccessoryViewID} />
    </>
  );
}
