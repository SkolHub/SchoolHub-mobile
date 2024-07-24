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
  return api
    .get(`/subject/student/with-metrics`)
    .then((res) => res.data as Class[]);
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

export interface SubjectStudent {
  student: {
    id: number;
    name: string;
  };
  average: string;
  count: string;
}

const fetchTeacherSubjects = async () => {
  return api.get(`/subject/teacher`).then((res) => res.data as TeacherClass[]);
};

const fetchTeacherSubjectStats = async (id: string) => {
  return api.get(`/subject/teacher/${id}/grade-metrics`).then(
    (res) =>
      res.data as {
        average: string;
        averagecount: string;
      }
  );
};

const fetchFewGrades = async (id: string) => {
  return api.get(`/subject/teacher/${id}/few-grades/`).then((res) => res.data);
};

const fetchStudents = async (id: string) => {
  return api
    .get(`/subject/teacher/${id}`)
    .then((res) => res.data as SubjectStudent[]);
};

export const useGetTeacherSubjects = () => {
  return useQuery({
    queryKey: ['teacherSubjects'],
    queryFn: fetchTeacherSubjects
  });
};

export const useGetTeacherSubjectStats = (id: string) => {
  return useQuery({
    queryKey: ['teacherSubjectStats', id],
    queryFn: () => fetchTeacherSubjectStats(id)
  });
};

export const useGetFewGrades = (id: string) => {
  return useQuery({
    queryKey: ['fewGrades', id],
    queryFn: () => fetchFewGrades(id)
  });
};

export const useGetStudents = (id: string) => {
  return useQuery({
    queryKey: ['students', id],
    queryFn: () => fetchStudents(id)
  });
};

// #s #################################################
//    Parent API
//    #################################################

const fetchParentSubjects = async () => {
  return api.get(`/subject/parent`).then((res) => res.data as Class[]);
};

export const useGetParentSubjects = () => {
  return useQuery({
    queryKey: ['parentSubjects'],
    queryFn: fetchParentSubjects
  });
};
