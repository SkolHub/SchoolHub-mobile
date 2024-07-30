import { useLocalSearchParams } from 'expo-router';
import {
  useGetSubmission,
  useGradeSubmission,
  useRedoSubmission
} from '@/api/submission';
import LoadingView from '@/components/loading-view';
import ErrorView from '@/components/error-view';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import tw from '@/lib/tailwind';
import { formatShortDate, formatTime } from '@/lib/utils';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useEffect, useState } from 'react';
import * as FileSystem from 'expo-file-system';
import FileViewer from 'react-native-file-viewer';
import Caption from '@/components/caption';
import DatePicker from 'react-native-date-picker';
import FormInput from '@/components/form-input';
import GradePicker from '@/components/grade-picker';
import LargeButton from '@/components/large-button';
import * as LocalAuthentication from 'expo-local-authentication';
import GeneralModal from '@/components/general-modal';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useCreateGrades } from '@/api/grade';
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

export default function Submission() {
  const { postID, studentID, subjectID, postName } = useLocalSearchParams();

  const submission = useGetSubmission(postID as string, studentID as string);
  const createGrade = useCreateGrades();
  const gradeSubmission = useGradeSubmission();
  const returnSubmission = useRedoSubmission();

  const [visible, setVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [grade, setGrade] = useState(-1);
  const [gradeErr, setGradeErr] = useState(false);

  const { showActionSheetWithOptions } = useActionSheet();

  const [returnVisible, setReturnVisible] = useState(false);

  const returnSchema = yup.object().shape({
    comment: yup.string().required("Comment can't be empty")
  });
  const returnForm = useForm({
    mode: 'onChange',
    defaultValues: {
      comment: ''
    },
    resolver: yupResolver(returnSchema)
  });

  const onSubmitReturn = async (data: any) => {
    await returnSubmission.mutateAsync({
      postID: +(postID as string),
      studentID: +(studentID as string),
      comment: data.comment
    });

    await submission.refetch();
    setReturnVisible(false);
  };

  const schema = yup.object().shape({
    reason: yup.string().required("Reason can't be empty"),
    comment: yup.string().required("Comment can't be empty")
  });
  const { control, handleSubmit, setValue } = useForm({
    mode: 'onChange',
    defaultValues: {
      reason: postName as string,
      comment: ''
    },
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: any) => {
    const gradeIDs = await createGrade.mutateAsync({
      subjectID: +(subjectID as string),
      grades: [
        {
          studentID: +(studentID as string),
          value: grade.toString(),
          date: date.toISOString(),
          reason: data.message
        }
      ]
    });

    await gradeSubmission.mutateAsync({
      postID: +(postID as string),
      studentID: +(studentID as string),
      comment: data.comment,
      gradeID: gradeIDs[0].id
    });

    await submission.refetch();
    setVisible(false);
  };

  useEffect(() => {
    if (submission.data?.timestamp) {
      setDate(new Date(submission.data.timestamp));
    }
  }, [submission.data]);

  if (submission.isPending) {
    return <LoadingView />;
  }

  if (submission.isError) {
    return (
      <ErrorView
        refetch={submission.refetch}
        error={submission.error.message}
      />
    );
  }

  return (
    <ScrollView
      style={tw`bg-secondary-100 px-4 dark:bg-primary-950`}
      contentContainerStyle={tw`gap-4`}
    >
      <View style={tw`rounded-3xl bg-neutral-50 p-4 dark:bg-neutral-700`}>
        <Text
          style={tw`text-base font-bold text-primary-900 dark:text-primary-50`}
        >
          {submission.data.student?.name}
        </Text>
        <Text
          style={tw`text-sm font-bold text-primary-900 dark:text-primary-50`}
        >
          <Trans>
            Submitted at{' '}
            {formatTime(submission.data.timestamp) +
              ', ' +
              formatShortDate(submission.data.timestamp)}
          </Trans>
        </Text>
      </View>
      <View style={tw`gap-3 rounded-3xl bg-neutral-50 p-4 dark:bg-neutral-700`}>
        <Caption text={t`Attachments`} style={'p-0'} />
        {submission.data.attachments?.map((a) => (
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
          </Pressable>
        ))}
      </View>
      <View style={tw`rounded-3xl bg-neutral-50 p-4 dark:bg-neutral-700`}>
        <View>
          {submission.data.grade?.id && (
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
                  {submission.data.grade.value ?? t`No grade`}
                </Text>
              </View>
            </>
          )}
          {submission.data.comment && (
            <>
              <Caption text={t`Submission comment`} style={'pb-1 pt-3'} />
              <View
                style={tw`mb-3 flex-row items-center justify-between rounded-2xl bg-neutral-200 p-4 dark:bg-neutral-600`}
              >
                <Text
                  style={tw`text-base font-semibold text-primary-900 dark:text-primary-50`}
                >
                  {submission.data.comment}
                </Text>
              </View>
            </>
          )}
        </View>
        {!submission.data.grade?.id && (
          <LargeButton
            text={t`Grade submission`}
            onPress={() => {
              setVisible(true);
            }}
            style={'pb-3'}
          />
        )}
        {submission.data.status === 'submitted' &&
          !submission.data.grade?.id && (
            <LargeButton
              text={t`Return submission`}
              onPress={() => {
                setReturnVisible(true);
              }}
              contentContainerStyle={'bg-neutral-200 dark:bg-neutral-600'}
              textStyle={'text-red-500 dark:text-red-400'}
            />
          )}
        <GeneralModal
          title={t`Return submission`}
          visible={returnVisible}
          setVisible={setReturnVisible}
        >
          <ScrollView>
            <View onStartShouldSetResponder={() => true} style={tw`flex-1`}>
              <>
                <Caption text={t`Submission comment`} style={'pt-0'} />
                <FormInput
                  inModal={true}
                  control={returnForm.control}
                  name={'comment'}
                  placeholder={t`Comment for the submission...`}
                  secureTextEntry={false}
                  inputAccessoryViewID={''}
                  errorText={t`Comment is required`}
                  contentType={''}
                  flex1={false}
                />
                <LargeButton
                  text={t`Return submission`}
                  onPress={() => {
                    returnForm.handleSubmit(() => {
                      showActionSheetWithOptions(
                        {
                          options: [t`Return`, t`Cancel`],
                          cancelButtonIndex: 1,
                          title: t`Are you sure you want to return this submission?`
                        },
                        (buttonIndex) => {
                          if (buttonIndex === 0) {
                            LocalAuthentication.authenticateAsync({
                              promptMessage: t`Authenticate to return submission`
                            }).then((res) => {
                              if (res.success) {
                                returnForm.handleSubmit(onSubmitReturn)();
                              }
                            });
                          }
                        }
                      );
                    })();
                  }}
                  style={'mt-4'}
                  symbol={{
                    name: 'faceid',
                    fallback: 'fingerprint'
                  }}
                />
              </>
            </View>
          </ScrollView>
        </GeneralModal>
        <GeneralModal
          title={t`Add grade for ${submission.data.student?.name}`}
          visible={visible}
          setVisible={setVisible}
        >
          <ScrollView contentContainerStyle={tw`pb-10`}>
            <View onStartShouldSetResponder={() => true} style={tw`flex-1`}>
              <>
                <Caption text={'Date'} />
                <DatePicker
                  style={tw`self-center`}
                  mode='date'
                  date={date}
                  onDateChange={setDate}
                  maximumDate={new Date()}
                />
                <Caption text={t`Reason`} />
                <FormInput
                  inModal={true}
                  control={control}
                  name={'reason'}
                  placeholder={t`Reason for the grade...`}
                  secureTextEntry={false}
                  inputAccessoryViewID={''}
                  errorText={t`Reason is required`}
                  contentType={''}
                  flex1={false}
                />
                <Caption text={t`Grade`} />
                <GradePicker
                  value={grade}
                  onSelect={(value) => {
                    setGrade(value);
                    setGradeErr(false);
                  }}
                  style={
                    gradeErr ? 'border border-red-500 dark:border-red-400' : ''
                  }
                />
                {gradeErr && (
                  <Text style={tw`text-red-500 dark:text-red-400`}>
                    <Trans>Grade is required</Trans>
                  </Text>
                )}
                <Caption text={t`Submission comment`} />
                <FormInput
                  inModal={true}
                  control={control}
                  name={'comment'}
                  placeholder={t`Comment for the submission...`}
                  secureTextEntry={false}
                  inputAccessoryViewID={''}
                  errorText={t`Comment is required`}
                  contentType={''}
                  flex1={false}
                />
                <LargeButton
                  text={t`Add grade`}
                  onPress={() => {
                    if (grade === -1) {
                      setGradeErr(true);
                      handleSubmit(() => {})();
                    } else {
                      handleSubmit(() => {
                        showActionSheetWithOptions(
                          {
                            options: [t`Add`, t`Cancel`],
                            cancelButtonIndex: 1,
                            title: t`Are you sure you want to add this grade?`
                          },
                          (buttonIndex) => {
                            if (buttonIndex === 0) {
                              LocalAuthentication.authenticateAsync({
                                promptMessage: t`Authenticate to add grade`
                              }).then((res) => {
                                if (res.success) {
                                  handleSubmit(onSubmit)();
                                }
                              });
                            }
                          }
                        );
                      })();
                    }
                  }}
                  style={'mt-4'}
                  symbol={{
                    name: 'faceid',
                    fallback: 'fingerprint'
                  }}
                />
              </>
            </View>
          </ScrollView>
        </GeneralModal>
      </View>
    </ScrollView>
  );
}
