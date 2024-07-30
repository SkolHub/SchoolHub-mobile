import api from '@/api/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import Submission from '@/api/submission';

export interface Post {
  id: number;
  title: string;
  body: string;
  type: 'announcement' | 'assignment' | 'material' | 'test';
  subjectID: number;
  dueDate: string;
  timestamp: string;
  member: {
    id: number;
    name: string;
  };
  comments: Comment[];
  submission?: Submission;
  subjectName?: string;
  classes?: string[];
  submissions: {
    id: number;
    source: string;
  }[];
  attachments: {
    id: number;
    source: string;
  }[];
}

export interface Comment {
  id: number;
  body: string;
  timestamp: string;
  member: {
    id: number;
    name: string;
  };
}

const fetchStudentSubjectPosts = async (id: string) => {
  return api
    .get(`/post/student/subject/${id}`)
    .then((res) => res.data as Post[]);
};

const fetchStudentOrganizationAssignments = async () => {
  return api
    .get(`/post/student/organization`)
    .then((res) => res.data as Post[]);
};

const fetchStudentPost = async (id: string) => {
  return api.get(`/post/student/${id}`).then((res) => res.data as Post);
};

const createStudentPost = async (data: {
  title: string;
  body: string;
  subjectID: string;
}) => {
  return api.post(`/post/student`, data).then((res) => res.data as null);
};

const deletePost = async (id: number) => {
  return api.delete(`/post/${id}`).then((res) => res.data as null);
};

const createStudentComment = async (data: { body: string; postID: number }) => {
  return api.post(`/post-comment/`, data).then((res) => res.data as null);
};

const deleteComment = async (id: number) => {
  return api.delete(`/post-comment/${id}`).then((res) => res.data as null);
};

export const useGetStudentSubjectPosts = (id: string) => {
  return useQuery({
    queryKey: ['posts', id],
    queryFn: () => fetchStudentSubjectPosts(id)
  });
};

export const useGetStudentOrganizationAssignments = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: fetchStudentOrganizationAssignments
  });
};

export const useGetStudentPost = (id: string) => {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => fetchStudentPost(id),
    staleTime: 1000 * 60 * 5
  });
};

export const useCreateStudentPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      title,
      body,
      subjectID
    }: {
      title: string;
      body: string;
      subjectID: string;
    }) => createStudentPost({ title, body, subjectID }),
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
      await queryClient.invalidateQueries({ queryKey: ['posts'] });
      await queryClient.invalidateQueries({
        queryKey: ['posts', variables.subjectID]
      });
    }
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deletePost(id),
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
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({
        queryKey: ['posts', variables.toString()]
      });
      Toast.show({
        type: 'customToast',
        text1: 'Post deleted',
        text2: 'Your post has been successfully deleted',
        position: 'bottom',
        visibilityTime: 8000
      });
    }
  });
};

export const useCreateStudentComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ body, postID }: { body: string; postID: number }) =>
      createStudentComment({ body, postID }),
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
        queryKey: ['post', variables.postID.toString()]
      });
    }
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, postID }: { id: number; postID: number }) =>
      deleteComment(id),
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
      queryClient
        .invalidateQueries({
          queryKey: ['post', variables.postID.toString()]
        })
        .then(() => {
          Toast.show({
            type: 'customToast',
            text1: 'Comment deleted',
            text2: 'Your comment has been successfully deleted',
            position: 'bottom',
            visibilityTime: 8000
          });
        });
    }
  });
};

// #s #################################################
//    Teacher API
//    #################################################

export interface TeacherSubmission {
  status: string;
  comment: string;
  grade?: {
    id: number | null;
    value: number | null;
    timestamp: string | null;
    date: string | null;
    reason: string | null;
  };
  studentID: number;
  timestamp: string;
  studentName: string;
}

export interface TeacherPost extends Omit<Post, 'submissions'> {
  submissions: TeacherSubmission[];
  studentCount: number;
}

const fetchTeacherOrganizationAssignments = async () => {
  return api
    .get(`/post/teacher/organization`)
    .then((res) => res.data as TeacherPost[]);
};

const fetchTeacherSubjectPosts = async (id: string) => {
  return api
    .get(`/post/teacher/subject/${id}`)
    .then((res) => res.data as TeacherPost[]);
};

const fetchTeacherPost = async (id: string) => {
  return api.get(`/post/teacher/${id}`).then((res) => res.data as TeacherPost);
};

const createTeacherPost = async (data: {
  title: string;
  body: string;
  type: 'announcement' | 'assignment' | 'material' | 'test';
  subjectID: string;
  dueDate?: string;
}) => {
  return api.post(`/post/teacher`, data).then((res) => res.data as null);
};

const createTeacherComment = async (data: { body: string; postID: number }) => {
  return api.post(`/post-comment/`, data).then((res) => res.data as null);
};

export const useGetTeacherOrganizationAssignments = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: fetchTeacherOrganizationAssignments
  });
};

export const useGetTeacherSubjectPosts = (id: string) => {
  return useQuery({
    queryKey: ['posts', id],
    queryFn: () => fetchTeacherSubjectPosts(id)
  });
};

export const useGetTeacherPost = (id: string) => {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => fetchTeacherPost(id),
    staleTime: 1000 * 60 * 5
  });
};

export const useCreateTeacherPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      title,
      body,
      type,
      subjectID,
      dueDate
    }: {
      title: string;
      body: string;
      type: 'announcement' | 'assignment' | 'material' | 'test';
      subjectID: string;
      dueDate?: string;
    }) => createTeacherPost({ title, body, type, subjectID, dueDate }),
    onError: (err) => {
      Toast.show({
        type: 'customToast',
        text1: 'Error',
        text2: JSON.stringify(err),
        position: 'bottom',
        visibilityTime: 8000
      });
    },
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries({ queryKey: ['posts'] });
      await queryClient.invalidateQueries({
        queryKey: ['posts', variables.subjectID.toString()]
      });
    }
  });
};

export const useCreateTeacherComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ body, postID }: { body: string; postID: number }) =>
      createTeacherComment({ body, postID }),
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
        queryKey: ['post', variables.postID.toString()]
      });
    }
  });
};
