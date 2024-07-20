import { router, useLocalSearchParams } from 'expo-router';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
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

export default function Assignment() {
  const { postID } = useLocalSearchParams();
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
    createComment.mutate({ postID: +(postID as string), body: data.comment });
    reset();
  };

  if (post.isPending || accountID.isPending) {
    return <LoadingView />;
  }

  if (post.isError || accountID.isError) {
    return (
      <ErrorView refetch={post.refetch} error={post.error?.message ?? ''} />
    );
  }

  console.log('hellooooooo0o0');
  console.log(post.data);
  // post.data.comments = post.data.comments.sort((a, b) => {
  //   return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  // });

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={post.isPending} onRefresh={post.refetch} />
      }
      style={tw`bg-secondary-100 px-4 dark:bg-primary-950`}
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
                style={tw`text-xl font-semibold text-primary-800 dark:text-primary-50`}
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
              style={tw`mt-[-2px] text-base font-semibold leading-tight text-primary-700 dark:text-primary-100`}
            >
              {post.data.dueDate
                ? 'Due ' + formatShortDate(post.data.dueDate)
                : 'No due date'}
            </Text>
          </View>
        </View>
        <View style={tw`flex-row justify-between`}>
          <Text
            style={tw`text-base font-semibold text-primary-700 dark:text-primary-100`}
          >
            {post.data.member.name}
          </Text>
          <Text
            style={tw`text-base font-semibold text-primary-700 dark:text-primary-100`}
          >
            {formatTime(post.data.timestamp) +
              ', ' +
              formatShortDate(post.data.timestamp)}
          </Text>
        </View>
      </View>
      <View style={tw`rounded-3xl bg-neutral-50 p-4 dark:bg-neutral-700`}>
        <Text
          style={tw` text-base font-semibold text-primary-700 dark:text-primary-100`}
        >
          {post.data.body.trim()}
        </Text>
      </View>
      <Caption text={'Student submissions'} />
      <View style={tw`gap-3`}>
        <StatsSummaryView
          data={[{ assigned: '9' }, { total: '10' }, { graded: '10' }]}
        />
        <LargeButton
          text={'View student submissions'}
          onPress={() => {
            router.push('/teacher/post/assignment/submissions');
          }}
        />
      </View>
      <Caption text={'Comments'} />
      <View style={tw`mb-3 flex-1 flex-row gap-2`}>
        <FormInput
          control={control}
          name='comment'
          placeholder='Write your comment here...'
          secureTextEntry={false}
          inputAccessoryViewID={inputAccessoryViewID}
          errorText=''
          contentType='none'
          flex1={true}
          shouldError={false}
        />
        <SmallButton
          contentContainerStyle={'h-14 w-14 rounded-2xl'}
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
          />
        ))}
      </View>
    </ScrollView>
  );
}
