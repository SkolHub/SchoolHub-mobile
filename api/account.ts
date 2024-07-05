import api from '@/api/api';
import { useQuery } from '@tanstack/react-query';

const fetchAccount = async () => {
  return api.get(`/profile`).then((res) => {
    return res.data;
  });
};

export const useGetAccount = () => {
  return useQuery({
    queryKey: ['account'],
    queryFn: fetchAccount,
    staleTime: 1000 * 60 * 5
  });
};
