import api from '@/api/api';
import { useQuery } from '@tanstack/react-query';

export interface Grade {
  id: number;
  value: string;
  date: string;
  reason: string;
  teacher: {
    id: number;
    name: string;
  };
  timestamp: string;
}

export interface Absence {
  id: number;
  excused: boolean;
  date: string;
  reason: string;
  teacher: {
    id: number;
    name: string;
  };
  timestamp: string;
}

export interface OrganizationGradesAbsences {
  grades: Array<{
    subjectID: number;
    grades: Grade[];
  }>;
  absences: Array<{
    subjectID: number;
    absences: Absence[];
  }>;
}

export interface SubjectGradesAbsences {
  grades: Grade[];
  absences: Absence[];
}

const fetchStudentOrganizationGradesAbsences = async () => {
  return api
    .get('/grade/student/organization')
    .then((res) => res.data as OrganizationGradesAbsences);
};

const fetchStudentSubjectGradesAbsences = async (id: number) => {
  return api
    .get(`/grade/student/subject/${id}`)
    .then((res) => res.data as SubjectGradesAbsences);
};

export const useGetStudentOrganizationGradesAbsences = () => {
  return useQuery({
    queryKey: ['grades'],
    queryFn: fetchStudentOrganizationGradesAbsences
  });
};

export const useGetStudentSubjectGradesAbsences = (id: number) => {
  return useQuery({
    queryKey: ['grades', id],
    queryFn: () => fetchStudentSubjectGradesAbsences(id)
  });
};
