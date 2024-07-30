import api from '@/api/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

export default interface Submission {
  comment: string;
  timestamp: string;
  grade?: {
    id?: number;
    value?: number;
    timestamp?: string;
    date?: string;
    reason?: string;
  };
  attachments: {
    id: number;
    source: string;
  }[];
  status: string;
  student: {
    id: number;
    name: string;
  };
}

const addFileAttachment = async (data: {
  file: {
    uri: string;
    name: string;
    type: string;
  };
  postID: number;
}) => {
  const formData = new FormData();
  // @ts-ignore
  formData.append('file', data.file);
  return api
    .post(`/post-submission-attachment/file/${data.postID}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then((res) => res.data as null);
};

const addLinkAttachment = async (data: { link: string; postID: number }) => {
  return api
    .post(`/post-submission-attachment/link/${data.postID}`, data)
    .then((res) => res.data as null);
};

const removeAttachment = async (attachmentID: number) => {
  return api
    .delete(`/post-submission-attachment/${attachmentID}`)
    .then((res) => res.data as null);
};

const fetchSubmission = async (postID: number, studentID: number) => {
  return api
    .get(`/post-submission/post/${postID}/student/${studentID}`)
    .then((res) => res.data as Submission);
};

const turnInSubmission = async (postID: number) => {
  return api
    .patch(`/post-submission/turn-in/${postID}`)
    .then((res) => res.data as null);
};

const unsubmitSubmission = async (postID: number) => {
  return api
    .patch(`/post-submission/un-submit/${postID}`)
    .then((res) => res.data as null);
};

const redoSubmission = async (data: {
  postID: number;
  studentID: number;
  comment: string;
}) => {
  return api
    .patch(`/post-submission/redo`, data)
    .then((res) => res.data as null);
};

const gradeSubmission = async (data: {
  postID: number;
  studentID: number;
  comment: string;
  gradeID: number;
}) => {
  return api
    .patch(`/post-submission/grade`, data)
    .then((res) => res.data as null);
};

export const useGetSubmission = (postID: string, studentID: string) => {
  return useQuery({
    queryKey: ['submission', postID, studentID],
    queryFn: () => fetchSubmission(+postID, +studentID)
  });
};

export const useAddFileAttachment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      file: {
        uri: string;
        name: string;
        type: string;
      };
      postID: number;
    }) => addFileAttachment(data),
    onSettled: (data, error, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ['post', variables.postID.toString()]
      });
      Toast.show({
        type: 'customToast',
        text1: 'Attachment added',
        text2: 'Your attachment has been added',
        position: 'bottom',
        visibilityTime: 8000
      });
    },
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

export const useAddLinkAttachment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { link: string; postID: number }) =>
      addLinkAttachment(data),
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries({
        queryKey: ['post', variables.postID.toString()]
      });
    },
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

export const useRemoveAttachment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (attachmentID: number) => removeAttachment(attachmentID),
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

export const useTurnInSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postID: number) => turnInSubmission(postID),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ['post', variables.toString()]
      });
      Toast.show({
        type: 'customToast',
        text1: 'Turned in successfully',
        text2: 'Your submission has been turned in',
        position: 'bottom',
        visibilityTime: 8000
      });
    },
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

export const useUnsubmitSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postID: number) => unsubmitSubmission(postID),
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
      queryClient.invalidateQueries({
        queryKey: ['post', variables.toString()]
      });
      Toast.show({
        type: 'customToast',
        text1: 'Unsubmitted successfully',
        text2: 'Your submission has been unsubmitted',
        position: 'bottom',
        visibilityTime: 8000
      });
    }
  });
};

export const useGradeSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      postID: number;
      studentID: number;
      comment: string;
      gradeID: number;
    }) => gradeSubmission(data),
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
      await queryClient.invalidateQueries({
        queryKey: [
          'submission',
          variables.postID.toString(),
          variables.studentID.toString()
        ]
      });
    }
  });
};

export const useRedoSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      postID: number;
      studentID: number;
      comment: string;
    }) => redoSubmission(data),
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
      await queryClient.invalidateQueries({
        queryKey: [
          'submission',
          variables.postID.toString(),
          variables.studentID.toString()
        ]
      });
    }
  });
};
