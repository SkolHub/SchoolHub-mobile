import api from '@/api/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

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

const fetchStudentOrganizationGradesAbsences = async () => {
  return api
    .get('/grade/student/organization')
    .then((res) => res.data as OrganizationGradesAbsences);
};

const fetchStudentSubjectGrades = async (id: number) => {
  return api.get(`/grade/student/${id}`).then((res) => res.data as Grade[]);
};

const fetchStudentSubjectAbsences = async (id: number) => {
  return api.get(`/absence/student/${id}`).then((res) => res.data as Absence[]);
};

export const useGetStudentOrganizationGradesAbsences = () => {
  return useQuery({
    queryKey: ['grades'],
    queryFn: fetchStudentOrganizationGradesAbsences
  });
};

export const useGetStudentSubjectGrades = (id: number) => {
  return useQuery({
    queryKey: ['grades', id],
    queryFn: () => fetchStudentSubjectGrades(id)
  });
};

export const useGetStudentSubjectAbsences = (id: number) => {
  return useQuery({
    queryKey: ['absences', id],
    queryFn: () => fetchStudentSubjectAbsences(id)
  });
};

// #s #################################################
//    Teacher API
//    #################################################

export interface BatchGrades {
  grades: {
    studentID: number;
    value: string;
    reason?: string;
    date: string;
  }[];
  subjectID: number;
}

const fetchStudentGrades = async ({
  subjectID,
  studentID
}: {
  subjectID: string;
  studentID: string;
}) => {
  return api
    .get(`/grade/teacher/subject/${subjectID}/student/${studentID}`)
    .then((res) => res.data as Grade[]);
};

const fetchStudentAbsences = async ({
  subjectID,
  studentID
}: {
  subjectID: string;
  studentID: string;
}) => {
  return api
    .get(`/absence/teacher/subject/${subjectID}/student/${studentID}`)
    .then((res) => res.data as Absence[]);
};

const createGrades = async (grades: BatchGrades) => {
  return api.post('/grade/teacher', grades);
};

const updateGrade = async (data: {
  grade: {
    reason?: string;
    value?: string;
  };
  id: number;
}) => {
  return api.patch(`/grade/teacher/${data.id}`, data.grade);
};

const deleteGrades = async (grades: number[]) => {
  return api.delete(`/grade/teacher`, { data: { objects: grades } });
};

export const useGetStudentGrades = ({
  subjectID,
  studentID
}: {
  subjectID: string;
  studentID: string;
}) => {
  return useQuery({
    queryKey: ['studentSubjectGrades', subjectID, studentID],
    queryFn: () => fetchStudentGrades({ subjectID, studentID })
  });
};

export const useGetStudentAbsences = ({
  subjectID,
  studentID
}: {
  subjectID: string;
  studentID: string;
}) => {
  return useQuery({
    queryKey: ['studentSubjectAbsences', subjectID, studentID],
    queryFn: () => fetchStudentAbsences({ subjectID, studentID })
  });
};

export const useCreateGrades = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (grades: BatchGrades) => createGrades(grades),
    onError: (err) => {
      Toast.show({
        type: 'customToast',
        text1: 'Error',
        text2: err.message,
        position: 'bottom',
        visibilityTime: 8000
      });
    },
    onSuccess: async (data, variables, context) => {
      Toast.show({
        type: 'customToast',
        text1: 'Grades submitted',
        text2: 'Your grades have been successfully submitted',
        position: 'bottom',
        visibilityTime: 8000
      });
      await queryClient.invalidateQueries({
        queryKey: ['teacherSubjectStats', variables.subjectID.toString()]
      });
    }
  });
};

export const useUpdateGrade = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      grade: { reason?: string; value?: string };
      id: number;
      subjectID: string;
    }) => updateGrade(data),
    onError: (err) => {
      Toast.show({
        type: 'customToast',
        text1: 'Error',
        text2: err.message,
        position: 'bottom',
        visibilityTime: 8000
      });
    },
    onSuccess: async (data, variables, context) => {
      Toast.show({
        type: 'customToast',
        text1: 'Grade updated',
        text2: 'Your grade has been successfully updated',
        position: 'bottom',
        visibilityTime: 8000
      });
      await queryClient.invalidateQueries({
        queryKey: ['teacherSubjectStats', variables.subjectID.toString()]
      });
    }
  });
};

export const useDeleteGrade = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { ids: number[]; subjectID: string }) =>
      deleteGrades(data.ids),
    onError: (err) => {
      Toast.show({
        type: 'customToast',
        text1: 'Error',
        text2: err.message,
        position: 'bottom',
        visibilityTime: 8000
      });
    },
    onSuccess: async (data, variables, context) => {
      Toast.show({
        type: 'customToast',
        text1: 'Grade deleted',
        text2: 'Your grade has been successfully deleted',
        position: 'bottom',
        visibilityTime: 8000
      });
      await queryClient.invalidateQueries({
        queryKey: [
          ['teacherSubjectStats', variables.subjectID.toString()],
          ['fewGrades', variables.subjectID.toString()],
          ['students', variables.subjectID.toString()],
          ['studentSubjectGrades', variables.subjectID.toString()]
        ]
      });
    }
  });
};
