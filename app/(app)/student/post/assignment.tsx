import { useLocalSearchParams } from 'expo-router';
import {
  Linking,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View
} from 'react-native';
import {
  useCreateStudentComment,
  useDeleteComment,
  useGetStudentPost
} from '@/api/post';
import React, { useState } from 'react';
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
import Ionicons from '@expo/vector-icons/Ionicons';
import LargeButton from '@/components/large-button';
import {
  useAddFileAttachment,
  useAddLinkAttachment,
  useRemoveAttachment,
  useTurnInSubmission,
  useUnsubmitSubmission
} from '@/api/submission';
import { useActionSheet } from '@expo/react-native-action-sheet';
import CommentCard from '@/components/comment-card';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import FileViewer from 'react-native-file-viewer';
import GeneralModal from '@/components/general-modal';
import { t, Trans } from '@lingui/macro';

async function onFilePress(path: string) {
  const downloadResumable = FileSystem.createDownloadResumable(
    'http://localhost:8000/files/' + path,
    FileSystem.cacheDirectory + (path.match(/[^-]*-[^-]*-(.*)/)?.at(1) ?? path),
    {}
  );
  const download = await downloadResumable.downloadAsync();
  if (download?.uri) {
    await FileViewer.open(download.uri);
  }
}

export default function Assignment() {
  const { postID } = useLocalSearchParams();
  const post = useGetStudentPost(postID as string);
  const createComment = useCreateStudentComment();
  const deleteComment = useDeleteComment();

  const addFileAttachment = useAddFileAttachment();
  const addLinkAttachment = useAddLinkAttachment();
  const removeAttachment = useRemoveAttachment();

  const submit = useTurnInSubmission();
  const unsubmit = useUnsubmitSubmission();

  const { showActionSheetWithOptions } = useActionSheet();

  const [linkVisible, setLinkVisible] = useState(false);

  const linkSchema = yup.object({
    link: yup.string().trim().required()
  });
  const linkForm = useForm({
    defaultValues: {
      link: ''
    },
    mode: 'onChange',
    resolver: yupResolver(linkSchema)
  });
  const onSubmitLink = async (data: { link: string }) => {
    linkForm.reset();
    let formattedLink = data.link;
    if (
      !formattedLink.startsWith('http://') &&
      !formattedLink.startsWith('https://')
    ) {
      formattedLink = 'http://' + formattedLink;
    }
    await addLinkAttachment.mutateAsync({
      link: formattedLink,
      postID: +(postID as string)
    });
    setLinkVisible(false);
  };

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
      contentContainerStyle={tw`pb-20`}
    >
      {/*<Text>{JSON.stringify(post.data)}</Text>*/}
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
              style={tw`text-lg font-semibold leading-tight text-primary-800 dark:text-primary-50`}
            >
              {post.data.title}
            </Text>
            <Text
              style={tw`mt-[-2px] text-sm font-semibold leading-tight text-primary-700 dark:text-primary-100`}
            >
              {post.data.dueDate
                ? t`Due ${formatShortDate(post.data.dueDate)}`
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
      <Caption text={t`Your submission`} />
      {/*<Text>{post.data.submission?.status}</Text>*/}
      <View style={tw`gap-3 rounded-3xl bg-neutral-50 p-4 dark:bg-neutral-700`}>
        {/*<Text>{JSON.stringify(post.data.submission)}</Text>*/}
        {post.data.submission?.attachments?.map((a) => (
          <Pressable
            key={a.id}
            style={({ pressed }) =>
              tw.style(
                `flex-row items-center gap-2 rounded-2xl bg-neutral-200/50 p-3 dark:bg-neutral-600/50`,
                pressed && 'opacity-70'
              )
            }
            onPress={async () => {
              if (a.source.startsWith('http')) {
                await Linking.openURL(a.source);
              } else {
                await onFilePress(a.source);
              }
            }}
          >
            {a.source.startsWith('http') ? (
              <View style={tw`flex-1 flex-row items-center gap-2`}>
                <Ionicons
                  name={'link'}
                  size={20}
                  color={
                    tw.prefixMatch('dark')
                      ? tw.color('primary-100')
                      : tw.color('primary-700')
                  }
                />
                <Text
                  style={tw`text-sm font-semibold leading-tight text-primary-800 dark:text-primary-50`}
                >
                  {a.source}
                </Text>
              </View>
            ) : (
              <View style={tw`flex-1 flex-row items-center gap-2`}>
                <Ionicons
                  name={'document-attach'}
                  size={20}
                  color={
                    tw.prefixMatch('dark')
                      ? tw.color('primary-100')
                      : tw.color('primary-700')
                  }
                />
                <Text
                  style={tw`text-sm font-semibold leading-tight text-primary-800 dark:text-primary-50`}
                >
                  {a.source?.match(/[^-]*-[^-]*-(.*)/)?.at(1) ?? ''}
                </Text>
              </View>
            )}
            {!(
              post.data.submission?.status === 'graded' ||
              post.data.submission?.status === 'submitted'
            ) && (
              <Pressable>
                <Ionicons
                  name={'close-circle'}
                  size={20}
                  color={
                    tw.prefixMatch('dark')
                      ? tw.color('primary-200')
                      : tw.color('primary-700')
                  }
                  onPress={() => {
                    showActionSheetWithOptions(
                      {
                        options: [t`Delete`, t`Cancel`],
                        cancelButtonIndex: 1,
                        destructiveButtonIndex: 0,
                        title: t`Are you sure you want to delete this attachment?`
                      },
                      async (buttonIndex) => {
                        if (buttonIndex === 0) {
                          await removeAttachment.mutateAsync(a.id);
                          await post.refetch();
                        }
                      }
                    );
                  }}
                />
              </Pressable>
            )}
          </Pressable>
        ))}
        {post.data.submission?.status === 'submitted' ||
        post.data.submission?.status === 'graded' ? (
          <LargeButton
            text={t`Submitted`}
            contentContainerStyle={'dark:bg-neutral-600 bg-neutral-200'}
            iconName={'checkmark-circle'}
            textStyle={'text-green-600 dark:text-green-400'}
            onPress={() => {
              showActionSheetWithOptions(
                {
                  options: [t`Unsubmit`, t`Cancel`],
                  cancelButtonIndex: 1,
                  destructiveButtonIndex: 0,
                  title: t`Are you sure you want to unsubmit?`
                },
                (buttonIndex) => {
                  if (buttonIndex === 0) {
                    unsubmit.mutate(+(postID as string));
                  }
                }
              );
            }}
          />
        ) : (
          <View style={tw`gap-3`}>
            <LargeButton
              text={t`Add attachment`}
              onPress={() => {
                showActionSheetWithOptions(
                  {
                    options: [t`Link`, t`File`, t`Cancel`],
                    cancelButtonIndex: 2,
                    title: t`How would you like to add an attachment?`
                  },
                  (buttonIndex) => {
                    if (buttonIndex === 0) {
                      setLinkVisible(true);
                    } else if (buttonIndex === 1) {
                      DocumentPicker.getDocumentAsync()
                        .then(async (file) => {
                          await addFileAttachment.mutateAsync({
                            file: {
                              type:
                                file.assets![0].mimeType ??
                                'application/octet-stream',
                              name: file.assets![0].name,
                              uri: file.assets![0].uri
                            },
                            postID: +(postID as string)
                          });
                        })
                        .catch(() => {});
                    }
                  }
                );
              }}
              contentContainerStyle={'bg-neutral-200 dark:bg-neutral-600'}
              textStyle={'text-primary-700 dark:text-primary-100'}
              iconName={'add-outline'}
            />
            <LargeButton
              text={t`Submit`}
              onPress={() => {
                showActionSheetWithOptions(
                  {
                    options: [t`Submit`, t`Cancel`],
                    cancelButtonIndex: 1,
                    title: t`Are you sure you want to submit your work?`
                  },
                  (buttonIndex) => {
                    if (buttonIndex === 0) {
                      submit.mutate(+(postID as string));
                    }
                  }
                );
              }}
            />
          </View>
        )}
      </View>
      {post.data.submission?.grade?.id && post.data.submission?.comment && (
        <View
          style={tw`mt-4 gap-3 rounded-3xl bg-neutral-50 p-4 pt-0 dark:bg-neutral-700`}
        >
          {post.data.submission?.grade?.id && (
            <>
              <Caption
                text={t`Your submission has been graded`}
                style={'pb-0 text-green-500 dark:text-green-400'}
              />
              {post.data.submission.grade?.id && (
                <>
                  <Caption text={t`Grade`} style={'pb-1 pt-0'} />
                  <View
                    style={tw`flex-row items-center justify-between rounded-2xl bg-neutral-200 p-4 dark:bg-neutral-600`}
                  >
                    <Text
                      style={tw`text-base font-medium leading-tight text-primary-800 dark:text-primary-50`}
                    >
                      <Trans>Grade</Trans>
                    </Text>
                    <Text
                      style={tw`text-base font-medium leading-tight text-primary-800 dark:text-primary-50`}
                    >
                      {post.data.submission.grade.value ?? t`No grade`}
                    </Text>
                  </View>
                </>
              )}
            </>
          )}
          {post.data.submission?.comment &&
            post.data.submission?.status !== 'redo' && (
              <>
                <Caption text={t`Submission comment`} style={'pb-1 pt-3'} />
                <View
                  style={tw`flex-row items-center justify-between rounded-2xl bg-neutral-200 p-4 dark:bg-neutral-600`}
                >
                  <Text
                    style={tw`text-base font-semibold text-primary-900 dark:text-primary-50`}
                  >
                    {post.data.submission?.comment}
                  </Text>
                </View>
              </>
            )}
          {post.data.submission?.status === 'redo' && (
            <>
              <Caption
                text={t`Your submission has been returned`}
                style={'pb-0 text-red-500 dark:text-red-400'}
              />
              <View
                style={tw`flex-row items-center justify-between rounded-2xl bg-neutral-200 p-4 dark:bg-neutral-600`}
              >
                <Text
                  style={tw`text-base font-semibold text-primary-900 dark:text-primary-50`}
                >
                  {post.data.submission?.comment}
                </Text>
              </View>
            </>
          )}
        </View>
      )}
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
        {post.data.comments.map((comment, index) => (
          <CommentCard
            key={index}
            comment={comment}
            deleteComment={deleteComment}
            postID={postID as string}
            accountID={accountID}
            refetch={post.refetch}
          />
        ))}
      </View>
      <GeneralModal
        title={t`Link`}
        visible={linkVisible}
        setVisible={setLinkVisible}
      >
        <View style={tw`gap-3`}>
          <FormInput
            control={linkForm.control}
            name='link'
            placeholder={t`Enter the link here...`}
            secureTextEntry={false}
            inputAccessoryViewID={inputAccessoryViewID}
            errorText={t`Link is required`}
            contentType='none'
            shouldError={linkForm.formState.isSubmitted}
            flex1={false}
            inModal={true}
          />
          <LargeButton
            text={t`Add link`}
            onPress={linkForm.handleSubmit(onSubmitLink)}
          />
        </View>
      </GeneralModal>
    </ScrollView>
  );
}
