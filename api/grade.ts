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

export interface Observation {
  id: number;
  reason: string;
  timestamp: string;
  teacher: {
    id: number;
    name: string;
  };
  subject: {
    name: string;
  };
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
  return api
    .post('/grade/teacher', grades)
    .then((res) => res.data as { id: number }[]);
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

const createAbsences = async (absences: {
  absences: {
    studentID: number;
    date: string;
  }[];
  subjectID: number;
}) => {
  return api.post('/absence/teacher', absences).then((res) => res.data as null);
};

const updateAbsence = async (data: {
  absence: {
    reason: string;
  };
  id: number;
}) => {
  return api.patch(`/absence/teacher/${data.id}`, data.absence);
};

const excuseAbsences = async (absences: number[]) => {
  return api.patch(`/absence/teacher/excuse`, { absences });
};

const deleteAbsences = async (absences: number[]) => {
  return api.delete(`/absence/teacher`, { data: { objects: absences } });
};

const fetchStudentObservations = async ({
  subjectID,
  studentID
}: {
  subjectID: string;
  studentID: string;
}) => {
  return api
    .get(`/observation/subject/${subjectID}/student/${studentID}`)
    .then((res) => res.data as Observation[]);
};

const createObservations = async (observations: {
  observations: {
    reason: string;
    studentID: number;
  }[];
  subjectID: number;
}) => {
  return api.post('/observation', observations).then((res) => res.data as null);
};

const updateObservation = async (data: {
  observation: {
    reason: string;
  };
  id: number;
}) => {
  return api.patch(`/observation/${data.id}`, data.observation);
};

const deleteObservations = async (observations: number[]) => {
  return api.delete(`/observation`, { data: { objects: observations } });
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
      console.log(
        ['teacherSubjectStats', variables.subjectID.toString()],
        ['fewGrades', variables.subjectID.toString()],
        ['students', variables.subjectID.toString()],
        variables.grades.map((grade) => [
          'studentSubjectGrades',
          variables.subjectID.toString(),
          grade.studentID.toString()
        ])
      );
      await queryClient.invalidateQueries({
        queryKey: [
          ['teacherSubjectStats', variables.subjectID.toString()],
          ['fewGrades', variables.subjectID.toString()],
          ['students', variables.subjectID.toString()],
          variables.grades.map((grade) => [
            'studentSubjectGrades',
            variables.subjectID.toString(),
            grade.studentID.toString()
          ])
        ]
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

export const useCreateAbsences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (absences: {
      absences: { studentID: number; date: string }[];
      subjectID: number;
    }) => createAbsences(absences),
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
        text1: 'Absences submitted',
        text2: 'Your absences have been successfully submitted',
        position: 'bottom',
        visibilityTime: 8000
      });
      await queryClient.invalidateQueries({
        queryKey: [
          ['teacherSubjectStats', variables.subjectID.toString()],
          ['studentSubjectAbsences', variables.subjectID.toString()]
        ]
      });
    }
  });
};

export const useUpdateAbsence = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { absence: { reason: string }; id: number }) =>
      updateAbsence(data),
    onError: (err) => {
      Toast.show({
        type: 'customToast',
        text1: 'Error',
        text2: err.message,
        position: 'bottom',
        visibilityTime: 8000
      });
    }
  });
};

export const useExcuseAbsences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      absences,
      subjectID
    }: {
      absences: number[];
      subjectID: number;
    }) => excuseAbsences(absences),
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
        text1: 'Absences excused',
        text2: 'Your absences have been successfully excused',
        position: 'bottom',
        visibilityTime: 8000
      });
      await queryClient.invalidateQueries({
        queryKey: [
          ['teacherSubjectStats', variables.subjectID.toString()],
          ['studentSubjectAbsences', variables.subjectID.toString()]
        ]
      });
    }
  });
};

export const useDeleteAbsences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      absences,
      subjectID
    }: {
      absences: number[];
      subjectID: number;
    }) => deleteAbsences(absences),
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
        text1: 'Absences deleted',
        text2: 'Your absences have been successfully deleted',
        position: 'bottom',
        visibilityTime: 8000
      });
      await queryClient.invalidateQueries({
        queryKey: [
          ['teacherSubjectStats', variables.subjectID.toString()],
          ['studentSubjectAbsences', variables.subjectID.toString()]
        ]
      });
    }
  });
};

export const useGetStudentObservations = ({
  subjectID,
  studentID
}: {
  subjectID: string;
  studentID: string;
}) => {
  return useQuery({
    queryKey: ['studentSubjectObservations', subjectID, studentID],
    queryFn: () => fetchStudentObservations({ subjectID, studentID })
  });
};

export const useCreateObservations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (observations: {
      observations: { reason: string; studentID: number }[];
      subjectID: number;
    }) => createObservations(observations),
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
        text1: 'Observations submitted',
        text2: 'Your observations have been successfully submitted',
        position: 'bottom',
        visibilityTime: 8000
      });
      await queryClient.invalidateQueries({
        queryKey: [
          ['teacherSubjectStats', variables.subjectID.toString()],
          ['studentSubjectObservations', variables.subjectID.toString()]
        ]
      });
    }
  });
};

export const useUpdateObservation = () => {
  return useMutation({
    mutationFn: (data: { observation: { reason: string }; id: number }) =>
      updateObservation(data),
    onError: (err) => {
      Toast.show({
        type: 'customToast',
        text1: 'Error',
        text2: err.message,
        position: 'bottom',
        visibilityTime: 8000
      });
    }
  });
};

export const useDeleteObservations = () => {
  return useMutation({
    mutationFn: (observations: number[]) => deleteObservations(observations),
    onError: (err) => {
      Toast.show({
        type: 'customToast',
        text1: 'Error',
        text2: err.message,
        position: 'bottom',
        visibilityTime: 8000
      });
    },
    onSuccess: (data, variables, context) => {
      Toast.show({
        type: 'customToast',
        text1: 'Observations deleted',
        text2: 'Your observations have been successfully deleted',
        position: 'bottom',
        visibilityTime: 8000
      });
    }
  });
};

// #s #################################################
//    Parent API
//    #################################################

const fetchParentSubjectGrades = async (id: string) => {
  return api.get(`/grade/parent/${id}`).then((res) => res.data as Grade[]);
};

const fetchParentSubjectAbsences = async (id: string) => {
  return api.get(`/absence/parent/${id}`).then((res) => res.data as Absence[]);
};

const fetchParentObservations = async () => {
  return api.get('/observation').then((res) => res.data as Observation[]);
};

export const useGetParentSubjectGrades = (id: string) => {
  return useQuery({
    queryKey: ['grades', id],
    queryFn: () => fetchParentSubjectGrades(id)
  });
};

export const useGetParentSubjectAbsences = (id: string) => {
  return useQuery({
    queryKey: ['absences', id],
    queryFn: () => fetchParentSubjectAbsences(id)
  });
};

export const useGetParentObservations = () => {
  return useQuery({
    queryKey: ['observations'],
    queryFn: fetchParentObservations
  });
};
