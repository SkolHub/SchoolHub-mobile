import api from '@/api/api';
import { useQuery } from '@tanstack/react-query';

export interface Class {
  id: string;
  name: string;
  subjects: Subject[];
}

export interface Subject {
  id: string;
  icon: string;
  name: string;
  metadata: Record<any, any>;
}

const fetchStudentSubjects = async () => {
  return api.get(`/subject/student`).then((res) => res.data as Class[]);
};

export const useGetStudentSubjects = () => {
  return useQuery({
    queryKey: ['studentSubjects'],
    queryFn: fetchStudentSubjects
  });
};
