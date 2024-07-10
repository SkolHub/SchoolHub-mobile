import { router, Stack, useLocalSearchParams } from 'expo-router';
import {
  SafeAreaView,
  ScrollView,
  Text,
  useColorScheme,
  View
} from 'react-native';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import FormInput from '@/components/form-input';
import LargeButton from '@/components/large-button';
import LinkButton from '@/components/link-button';
import KeyboardAccessory from '@/components/keyboard-accessory';
import tw from '@/lib/tailwind';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSession } from '@/context/AuthContext';
import Toast from 'react-native-toast-message';

export default function SignIn() {
  const inputAccessoryViewID = 'keyboard-accessory';

  const { isSecondStep } = useLocalSearchParams();

  // const { addAccount, setLoggedIn, loggedIn, getAccount } = useAccount();
  const { signIn, session } = useSession();

  const colorScheme = useColorScheme();
  const schema = yup.object({
    email: yup.string().required(),
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
    console.log(data);
    const err = await signIn(data);
    if (err) {
      Toast.show({
        type: 'customToast',
        text1: "Can't sign you in!",
        text2: err,
        position: 'bottom'
      });
      console.log(JSON.stringify(err));
    } else {
      router.replace('/');
    }
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

  // useEffect(() => {
  //   if (loggedIn !== null) {
  //     router.replace('/');
  //   }
  // }, [loggedIn]);

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
        style={tw`flex-1 items-center justify-start bg-secondary-100 dark:bg-primary-950`}
      >
        <ScrollView
          style={tw`android:pt-28 flex w-full flex-1 px-4 pt-4`}
          contentContainerStyle={tw`gap-2 android:pt-20`}
        >
          {isSecondStep === 'true' ? (
            <View
              style={tw`mb-4 flex-row rounded-3xl bg-white p-4 pr-6 dark:bg-neutral-700`}
            >
              <Ionicons
                name={'checkmark-circle'}
                size={40}
                style={tw`pr-2`}
                color={tw.color('green-400')}
              />
              <Text
                style={tw`flex-1 text-base font-semibold leading-tight text-neutral-800 dark:text-neutral-200`}
              >
                Your organization has been created successfully! Now you can
                sign in.
              </Text>
            </View>
          ) : null}
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
              router.replace('/create-organization');
            }}
          />
        </ScrollView>
      </SafeAreaView>
      <KeyboardAccessory inputAccessoryViewID={inputAccessoryViewID} />
    </>
  );
}
