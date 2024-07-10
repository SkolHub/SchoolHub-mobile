import React from 'react';
import { useStorageState } from '@/hooks/useStorageState';
import api from '@/api/api';
import * as SecureStore from 'expo-secure-store';
import { Account } from '@/api/account';
import { useQueryClient } from '@tanstack/react-query';

const AuthContext = React.createContext<{
  signIn: ({
    email,
    password
  }: {
    email: string;
    password: string;
  }) => Promise<string | null>;
  signOut: () => void;
  signUp: ({
    firstName,
    lastName,
    username,
    email,
    password
  }: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
  }) => Promise<string | null>;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: () => Promise.resolve(null),
  signUp: () => Promise.resolve(null),
  signOut: () => null,
  session: null,
  isLoading: false
});

// This hook can be used to access the user info.
export function useSession() {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');

  return (
    <AuthContext.Provider
      value={{
        signIn: async ({
          email,
          password
        }: {
          email: string;
          password: string;
        }) => {
          let err = null;
          await api
            .post('/auth/login', { user: email, password })
            .then(async (res) => {
              setSession(res.data.token);
              const profile = await api.get('/profile', {
                headers: {
                  Authorization: `Bearer ${res.data.token}`
                }
              });
              await SecureStore.setItemAsync(
                'userID',
                (profile.data as Account).id.toString()
              );
              await SecureStore.setItemAsync(
                'role',
                (profile.data as Account).role.toString()
              );
            })
            .catch((error) => {
              err = error.response.data.message;
            });
          return err;
        },
        signUp: async ({
          firstName,
          lastName,
          username,
          email,
          password
        }: {
          firstName: string;
          lastName: string;
          username: string;
          email: string;
          password: string;
        }) => {
          let err = null;
          // await api
          //   .post('/auth/register', {
          //     email,
          //     password,
          //     user: username,
          //     firstName,
          //     lastName
          //   })
          //   .then(() => {
          //     setSession(null);
          //   })
          //   .catch((error) => {
          //     err = error.response.data.message;
          //   });
          return err;
        },
        signOut: async () => {
          // await api.post('/auth/logout');
          // const queryClient = useQueryClient();
          // queryClient.clear();
          setSession(null);
          await SecureStore.deleteItemAsync('userID');
          await SecureStore.deleteItemAsync('role');
        },
        session,
        isLoading
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
