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
  grades: number | null | undefined;
  average: number | null | undefined;
  teachers: Teacher[] | null;
  metadata: Record<any, any>;
}

export interface Teacher {
  id: string;
  name: string;
}

export interface SubjectStats {
  average: number;
  absences: number;
  assignments: number;
}

const fetchStudentSubjects = async () => {
  return api.get(`/subject/student`).then((res) => res.data as Class[]);
};

const fetchStudentSubjectStats = async (id: string) => {
  return api
    .get(`/subject/student/${id}`)
    .then((res) => res.data as SubjectStats);
};

const fetchStudentSubjectsWithStats = async () => {
  return api.get(`/subject/student/all`).then((res) => res.data as Class[]);
};

export const useGetStudentSubjects = () => {
  return useQuery({
    queryKey: ['studentSubjects'],
    queryFn: fetchStudentSubjects
  });
};

export const useGetSubjectStats = (id: string) => {
  return useQuery({
    queryKey: ['subjectStats', id],
    queryFn: () => fetchStudentSubjectStats(id)
  });
};

export const useGetStudentSubjectsWithStats = () => {
  return useQuery({
    queryKey: ['studentSubjectsWithStats'],
    queryFn: fetchStudentSubjectsWithStats
  });
};

// #s #################################################
//    Teacher API
//    #################################################

export interface TeacherClass {
  schoolClasses: Array<{
    id: number;
    name: string;
    classMasterID: number | null;
  }>;
  subjects: Subject[];
}

const fetchTeacherSubjects = async () => {
  return api.get(`/subject/teacher`).then((res) => res.data as TeacherClass[]);
};

export const useGetTeacherSubjects = () => {
  return useQuery({
    queryKey: ['teacherSubjects'],
    queryFn: fetchTeacherSubjects
  });
};
