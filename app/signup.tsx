import React, { useEffect } from 'react';
import { router, Stack } from 'expo-router';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { SafeAreaView, ScrollView, useColorScheme } from 'react-native';
import FormInput from '@/components/form-input';
import LargeButton from '@/components/large-button';
import LinkButton from '@/components/link-button';
import KeyboardAccessory from '@/components/keyboard-accessory';
import { useAccount } from '@/data/accounts';
import tw from '@/lib/tailwind';

export default function SignUp() {
  const inputAccessoryViewID = 'keyboard-accessory';
  const colorScheme = useColorScheme();

  const { addAccount, setLoggedIn, loggedIn } = useAccount();

  const schema = yup.object({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().required().min(8),
    repeatPassword: yup
      .string()
      .required()
      .oneOf([yup.ref('password')])
  });
  const { control, handleSubmit } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      repeatPassword: ''
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  });
  const onSubmit = async (data: any) => {
    addAccount({
      name: data.firstName,
      surname: data.lastName,
      email: data.email,
      organizations: [],
      classes: []
    });

    setLoggedIn({
      name: data.firstName,
      surname: data.lastName,
      email: data.email,
      organizations: [],
      classes: []
    });
  };

  useEffect(() => {
    if (loggedIn) {
      router.replace('/');
    }
  }, [loggedIn]);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Sign up',
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
            name={'firstName'}
            placeholder={'Name'}
            secureTextEntry={false}
            inputAccessoryViewID={inputAccessoryViewID}
            errorText={'Name is required'}
            contentType={'givenName'}
            flex1={false}
          />
          <FormInput
            control={control}
            name={'lastName'}
            placeholder={'Surname'}
            secureTextEntry={false}
            inputAccessoryViewID={inputAccessoryViewID}
            errorText={'Surname is required'}
            contentType={'familyName'}
            flex1={false}
          />
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
            errorText={'The password must have at least 8 characters'}
            contentType={'newPassword'}
            flex1={false}
          />
          <FormInput
            control={control}
            name={'repeatPassword'}
            placeholder={'Repeat password'}
            secureTextEntry={true}
            inputAccessoryViewID={inputAccessoryViewID}
            errorText={"'The passwords don't match"}
            contentType={'newPassword'}
            flex1={false}
          />
          <LargeButton
            text='Sign up'
            style='my-2'
            onPress={handleSubmit(onSubmit)}
          />
          <LinkButton
            text={`Already have an account? Sign in`}
            onPress={() => {
              router.replace('/login');
            }}
          />
        </ScrollView>
      </SafeAreaView>
      <KeyboardAccessory inputAccessoryViewID={inputAccessoryViewID} />
    </>
  );
}
