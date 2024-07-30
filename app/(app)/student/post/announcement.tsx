import { router, useLocalSearchParams } from 'expo-router';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import {
  useCreateStudentComment,
  useDeleteComment,
  useDeletePost,
  useGetStudentPost
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
import CommentCard from '@/components/comment-card';
import { t } from '@lingui/macro';

export default function Announcement() {
  const { postID } = useLocalSearchParams();
  const post = useGetStudentPost(postID as string);
  const deletePost = useDeletePost();
  const createComment = useCreateStudentComment();
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

  post.data.comments = post.data.comments.sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={post.isPending} onRefresh={post.refetch} />
      }
      style={tw`bg-secondary-100 px-4 dark:bg-primary-950`}
    >
      <View style={tw`mb-4 rounded-3xl bg-neutral-50 p-4 dark:bg-neutral-700`}>
        <View style={tw`flex-row justify-between`}>
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
    </ScrollView>
  );
}
