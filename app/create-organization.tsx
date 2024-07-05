import {
  SafeAreaView,
  ScrollView,
  Text,
  useColorScheme,
  View
} from 'react-native';
import tw from '@/lib/tailwind';
import React, { useEffect } from 'react';
import { router, Stack } from 'expo-router';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormInput from '@/components/form-input';
import LargeButton from '@/components/large-button';
import LinkButton from '@/components/link-button';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  CreateOrganization as OrgType,
  useCreateOrganization
} from '@/api/organization';
import Toast from 'react-native-toast-message';

export default function CreateOrganization() {
  const inputAccessoryViewID = 'keyboard-accessory';
  const colorScheme = useColorScheme();

  const createOrganization = useCreateOrganization();

  const schema = yup.object({
    email: yup.string().email().required(),
    password: yup
      .string()
      .required()
      .min(8)
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      ),
    displayName: yup.string().required(),
    organizationName: yup.string().required()
  });
  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: '',
      password: '',
      displayName: '',
      organizationName: ''
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  });
  const onSubmit = async (data: OrgType) => {
    createOrganization.mutate(data);
    // const account = getAccount(data.email);
    // if (account === null) {
    //   Toast.show({
    //     type: 'customToast',
    //     text1: "Can't sign you in!",
    //     text2: 'Email or password is incorrect',
    //     position: 'bottom'
    //   });
    //   return;
    // }
    // setLoggedIn(account);
  };

  useEffect(() => {
    if (createOrganization.isSuccess) {
      router.replace({
        pathname: '/login',
        params: { isSecondStep: 'true' }
      });
    }
  }, [createOrganization.isSuccess]);

  useEffect(() => {
    if (
      // @ts-ignore
      createOrganization.error?.response?.data?.message?.includes(
        'already exists'
      )
    ) {
      Toast.show({
        type: 'customToast',
        text1: 'Error',
        text2: 'User with the same email already exists!',
        position: 'bottom'
      });
    }
    // console.log(JSON.stringify(createOrganization.error.response.data.message));
  }, [createOrganization]);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Create an organization',
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
          style={tw`android:pt-28 flex w-full flex-1 px-4 pt-4`}
          contentContainerStyle={tw`gap-2 android:pt-20`}
        >
          <View
            style={tw`mb-4 flex-row rounded-3xl bg-white p-4 pr-6 dark:bg-neutral-700`}
          >
            <Ionicons
              name={'help-outline'}
              size={40}
              style={tw`pr-2 pt-1`}
              color={
                tw.prefixMatch('dark')
                  ? tw.color('primary-blue-200')
                  : tw.color('primary-blue-700')
              }
            />
            <Text
              style={tw`flex-1 text-base font-semibold leading-tight text-neutral-800 dark:text-neutral-200`}
            >
              When creating a new organization, you will also create a new
              administrator account with an email, name, and password that you
              will use to log into the organization.{' '}
            </Text>
          </View>
          <FormInput
            control={control}
            name={'organizationName'}
            placeholder={'Organization name'}
            secureTextEntry={false}
            inputAccessoryViewID={inputAccessoryViewID}
            errorText={'Organization name is required'}
            contentType={'emailAddress'}
            flex1={false}
          />
          <FormInput
            control={control}
            name={'displayName'}
            placeholder={'Display name'}
            secureTextEntry={false}
            inputAccessoryViewID={inputAccessoryViewID}
            errorText={'Display name is required'}
            contentType={'emailAddress'}
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
            errorText={
              'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character'
            }
            contentType={'password'}
            flex1={false}
          />
          <LargeButton
            text='Create organization'
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
    </>
  );
}
