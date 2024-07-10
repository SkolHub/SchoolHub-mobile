import { useLocalSearchParams } from 'expo-router';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import {
  useCreateComment,
  useDeleteComment,
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
import Ionicons from '@expo/vector-icons/Ionicons';
import LargeButton from '@/components/large-button';

export default function Assignment() {
  const { postID } = useLocalSearchParams();
  const post = useGetStudentPost(postID as string);
  const createComment = useCreateComment();
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
          <View>
            <Text
              style={tw`text-xl font-semibold leading-tight text-primary-800 dark:text-primary-50`}
            >
              {post.data.title}
            </Text>
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
      <Caption text={'Your submission'} />
      <View style={tw`gap-3 rounded-3xl bg-neutral-50 p-4 dark:bg-neutral-700`}>
        <SmallButton
          text={'Add attachment'}
          onPress={() => {}}
          contentContainerStyle={'bg-neutral-200 dark:bg-neutral-600'}
          iconName={'add-outline'}
        />
        <LargeButton text={'Submit'} onPress={() => {}} />
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
          <View
            style={tw`rounded-2xl bg-white px-4 py-3 pr-1 dark:bg-neutral-700`}
            key={comment.id}
          >
            <View style={tw`flex-row items-center justify-between`}>
              <View style={tw`w-full flex-row justify-between`}>
                <Text style={tw`text-base font-semibold dark:text-white`}>
                  {comment.member.name}
                </Text>
                <View style={tw`flex-row items-center`}>
                  <Text style={tw`text-base font-semibold dark:text-white`}>
                    {formatShortDate(comment.timestamp)}
                  </Text>
                  {comment.member.id === +(accountID.data as string) ? (
                    <DeleteDropdown
                      onDelete={() => {
                        deleteComment.mutate({
                          id: comment.id,
                          postID: +(postID as string)
                        });
                      }}
                    />
                  ) : null}
                </View>
              </View>
            </View>
            <Text style={tw` text-base dark:text-white`}>
              {comment.body.trim()}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
