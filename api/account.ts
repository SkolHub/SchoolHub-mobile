import api from '@/api/api';
import { useQuery } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';

export interface Account {
  id: number;
  name: string;
  role: 'student' | 'teacher' | 'admin' | 'parent';
  user: string;
  organization: {
    name: string;
  };
}

const fetchAccount = async () => {
  return api.get(`/profile`).then((res) => res.data as Account);
};

export const useGetAccount = () => {
  return useQuery({
    queryKey: ['account'],
    queryFn: fetchAccount,
    staleTime: 1000 * 60 * 5
  });
};

export const useGetAccountID = () => {
  return useQuery({
    queryKey: ['accountID'],
    queryFn: async () => {
      return await SecureStore.getItemAsync('userID');
    }
  });
};

export const useGetAccountRole = () => {
  return useQuery({
    queryKey: ['accountRole'],
    queryFn: async () => {
      return await SecureStore.getItemAsync('role');
    }
  });
};
