import api from '@/api/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

export default interface Submission {
  comment: string;
  timestamp: string;
  gradeID: number;
  submission_status: string;
}

const turnInSubmission = async (postID: number) => {
  return api
    .patch(`/post-submission/turn-in/${postID}`)
    .then((res) => res.data as null);
};

const unsubmitSubmission = async (postID: number) => {
  return api
    .patch(`/post-submission/unsubmit/${postID}`)
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

export const useTurnInSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postID: number) => turnInSubmission(postID),
    onSettled: (data, error, variables, context) => {
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
