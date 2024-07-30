import { router, useLocalSearchParams } from 'expo-router';
import { RefreshControl, Text, View } from 'react-native';
import {
  useCreateTeacherComment,
  useDeleteComment,
  useDeletePost,
  useGetTeacherPost
} from '@/api/post';
import React from 'react';
import LoadingView from '@/components/loading-view';
import ErrorView from '@/components/error-view';
import tw from '@/lib/tailwind';
import { formatShortDate, formatTime } from '@/lib/utils';
import Caption from '@/components/caption';
import FormInput from '@/components/form-input';
import SmallButton from '@/components/small-button';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useGetAccountID } from '@/api/account';
import DeleteDropdown from '@/components/delete-dropdown';
import Ionicons from '@expo/vector-icons/Ionicons';
import LargeButton from '@/components/large-button';
import StatsSummaryView from '@/components/stats-summary-view';
import CommentCard from '@/components/comment-card';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { t } from '@lingui/macro';

export default function Assignment() {
  const { postID, subjectID } = useLocalSearchParams();
  const post = useGetTeacherPost(postID as string);
  const deletePost = useDeletePost();

  const createComment = useCreateTeacherComment();
  const deleteComment = useDeleteComment();

  const accountID = useGetAccountID();

  const inputAccessoryViewID = 'keyboard-accessory';
  const schema = yup.object({
    comment: yup.string().trim().required()
  });
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      comment: ''
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  });
  const onSubmit = async (data: { comment: string }) => {
    reset();
    await createComment.mutateAsync({
      postID: +(postID as string),
      body: data.comment
    });
    await post.refetch();
  };

  if (post.isPending || accountID.isPending) {
    return <LoadingView />;
  }

  if (post.isError || accountID.isError) {
    return (
      <ErrorView refetch={post.refetch} error={post.error?.message ?? ''} />
    );
  }

  let submitted = 0;
  let notSubmitted = 0;
  let graded = 0;

  post.data.submissions.forEach((submission) => {
    if (submission.status === 'submitted') {
      submitted++;
    }
    if (submission.grade?.id) {
      graded++;
    }
  });

  notSubmitted = post.data.studentCount - submitted;

  // post.data.comments = post.data.comments.sort((a, b) => {
  //   return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  // });

  return (
    <KeyboardAwareScrollView
      refreshControl={
        <RefreshControl refreshing={post.isPending} onRefresh={post.refetch} />
      }
      style={tw`bg-secondary-100 px-4 dark:bg-primary-950`}
      contentContainerStyle={tw`pb-20`}
    >
      <View style={tw`mb-4 rounded-3xl bg-neutral-50 p-4 dark:bg-neutral-700`}>
        <View style={tw`mb-2 flex-row items-center gap-2.5`}>
          <Ionicons
            name={'document-attach'}
            size={30}
            color={
              tw.prefixMatch('dark')
                ? tw.color('primary-200')
                : tw.color('primary-700')
            }
          />
          <View style={tw`grow`}>
            <View style={tw`grow flex-row items-center justify-between`}>
              <Text
                style={tw`text-lg font-semibold text-primary-800 dark:text-primary-50`}
              >
                {post.data.title}
              </Text>
              {post.data.member.id == +(accountID.data as string) && (
                <DeleteDropdown
                  onDelete={() => {
                    deletePost.mutate(+(postID as string));
                    router.back();
                  }}
                />
              )}
            </View>
            <Text
              style={tw`mt-[-2px] text-sm font-semibold leading-tight text-primary-700 dark:text-primary-100`}
            >
              {post.data.dueDate
                ? t`Due ${formatShortDate(post.data.dueDate)}, ${formatTime(post.data.dueDate)}`
                : t`No due date`}
            </Text>
          </View>
        </View>
        <View style={tw`flex-row justify-between`}>
          <Text
            style={tw`text-sm font-semibold text-primary-700 dark:text-primary-100`}
          >
            {post.data.member.name}
          </Text>
          <Text
            style={tw`text-sm font-semibold text-primary-700 dark:text-primary-100`}
          >
            {formatTime(post.data.timestamp) +
              ', ' +
              formatShortDate(post.data.timestamp)}
          </Text>
        </View>
      </View>
      <View style={tw`rounded-3xl bg-neutral-50 p-4 dark:bg-neutral-700`}>
        <Text
          style={tw`text-base font-semibold leading-tight text-primary-700 dark:text-primary-100`}
        >
          {post.data.body.trim()}
        </Text>
      </View>
      <Caption text={t`Student submissions`} />
      <View style={tw`gap-3`}>
        <StatsSummaryView
          data={[
            { label: t`submitted`, value: submitted.toString() },
            { label: t`not submitted`, value: notSubmitted.toString() },
            { label: t`graded`, value: graded.toString() }
          ]}
        />
        <LargeButton
          text={t`View student submissions`}
          onPress={() => {
            router.push({
              pathname: '/teacher/post/assignment/submissions',
              params: { subjectID: post.data?.subjectID, postID: postID }
            });
          }}
        />
      </View>
      <Caption text={t`Comments`} />
      <View style={tw`mb-3 flex-1 flex-row gap-2`}>
        <FormInput
          control={control}
          name='comment'
          placeholder={t`Write your comment here...`}
          secureTextEntry={false}
          inputAccessoryViewID={inputAccessoryViewID}
          errorText=''
          contentType='none'
          flex1={true}
          shouldError={false}
        />
        <SmallButton
          contentContainerStyle={'h-12 w-12 rounded-2xl'}
          onPress={handleSubmit(onSubmit)}
          text={''}
          iconName={'send'}
        />
      </View>
      <View style={tw`gap-3`}>
        {post.data.comments.map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            deleteComment={deleteComment}
            postID={postID as string}
            accountID={accountID}
            refetch={post.refetch}
          />
        ))}
      </View>
    </KeyboardAwareScrollView>
  );
}
