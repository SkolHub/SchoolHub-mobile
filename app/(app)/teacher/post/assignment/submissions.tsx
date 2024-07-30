import { ScrollView, Text, View } from 'react-native';
import React, { ReactNode } from 'react';
import tw from '@/lib/tailwind';
import List from '@/components/list';
import ListItem from '@/components/list-item';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  router,
  useGlobalSearchParams,
  useLocalSearchParams
} from 'expo-router';
import { useGetTeacherPost } from '@/api/post';
import LoadingView from '@/components/loading-view';
import ErrorView from '@/components/error-view';
import { useGetStudents } from '@/api/subject';
import { t, Trans } from '@lingui/macro';

export default function Submissions() {
  const { postID, subjectID } = useGlobalSearchParams();
  const post = useGetTeacherPost(postID as string);
  const students = useGetStudents(subjectID as string);

  if (post.isPending || students.isPending) {
    return <LoadingView />;
  }

  if (post.isError) {
    return <ErrorView refetch={post.refetch} error={post.error.message} />;
  }

  if (students.isError) {
    return (
      <ErrorView refetch={students.refetch} error={students.error.message} />
    );
  }

  return (
    <ScrollView style={tw`bg-secondary-100 px-4 dark:bg-primary-950`}>
      <List>
        {students.data.map((student, index) => (
          <ListItem
            text={student.student.name}
            key={index}
            shouldPress={
              !!post.data.submissions.find((submission) => {
                return submission.studentID === student.student.id;
              })
            }
            onPress={() => {
              router.push({
                pathname: '/teacher/post/assignment/student-submission',
                params: {
                  studentID: student.student.id,
                  postID: postID,
                  studentName: student.student.name,
                  subjectID,
                  postName: post.data.title
                }
              });
            }}
            rightComponent={(() => {
              let submission = post.data.submissions.find((submission) => {
                return submission.studentID === student.student.id;
              });
              return (
                <View style={tw`flex-row`}>
                  <View style={tw`w-18 mr-3 items-center gap-1`}>
                    <Ionicons
                      name={
                        submission?.status === 'submitted'
                          ? 'checkmark-circle'
                          : 'close-circle'
                      }
                      size={20}
                      color={
                        submission?.status === 'submitted'
                          ? tw.prefixMatch('dark')
                            ? tw.color('green-400')
                            : tw.color('green-500')
                          : tw.prefixMatch('dark')
                            ? tw.color('red-400')
                            : tw.color('red-500')
                      }
                    />
                    <Text
                      style={tw.style(
                        'text-center text-sm font-medium leading-tight',
                        submission?.status === 'submitted'
                          ? 'text-green-500 dark:text-green-400'
                          : 'text-red-500 dark:text-red-400'
                      )}
                    >
                      {submission?.status === 'submitted'
                        ? t`Submitted`
                        : t`Missing`}
                    </Text>
                  </View>
                  <View style={tw`items-center gap-1`}>
                    {submission?.grade?.id ? (
                      <Text
                        style={tw`text-base font-medium leading-tight text-green-500 dark:text-green-400`}
                      >
                        {submission?.grade.value ?? ''}
                      </Text>
                    ) : (
                      <Ionicons
                        name={'close-circle'}
                        size={20}
                        color={
                          tw.prefixMatch('dark')
                            ? tw.color('red-400')
                            : tw.color('red-500')
                        }
                      />
                    )}
                    <Text
                      style={tw.style(
                        'text-sm font-medium leading-tight',
                        submission?.grade?.id
                          ? 'text-green-500 dark:text-green-400'
                          : 'text-red-500 dark:text-red-400'
                      )}
                    >
                      <Trans>Grade</Trans>
                    </Text>
                  </View>
                  <Ionicons
                    name='chevron-forward'
                    size={20}
                    color={
                      tw.prefixMatch('dark')
                        ? 'rgba(255, 255, 255, 0.4)'
                        : 'rgba(0, 0, 0, 0.4)'
                    }
                  />
                </View>
              ) as ReactNode;
            })()}
          />
        ))}
      </List>
    </ScrollView>
  );
}
