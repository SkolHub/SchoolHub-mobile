import {
  useCreateAbsences,
  useDeleteAbsences,
  useGetStudentAbsences
} from '@/api/grade';
import LoadingView from '@/components/loading-view';
import ErrorView from '@/components/error-view';
import { Text, View } from 'react-native';
import tw from '@/lib/tailwind';
import List from '@/components/list';
import ListItem from '@/components/list-item';
import { formatShortDate } from '@/lib/utils';
import Ionicons from '@expo/vector-icons/Ionicons';
import Caption from '@/components/caption';
import IconButton from '@/components/icon-button';
import LargeButton from '@/components/large-button';
import GeneralModal from '@/components/general-modal';
import DatePicker from 'react-native-date-picker';
import { useState } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { t, Trans } from '@lingui/macro';

export default function StudentAbsences({
  subjectID,
  studentID,
  studentName
}: {
  subjectID: string;
  studentID: string;
  studentName: string;
}) {
  const createAbsence = useCreateAbsences();
  const deleteAbsence = useDeleteAbsences();

  const absences = useGetStudentAbsences({
    subjectID: subjectID as string,
    studentID: studentID as string
  });

  const [visible, setVisible] = useState(false);
  const [date, setDate] = useState(new Date());

  // const schema = yup.object().shape({
  //   message: yup.string().required("Reason can't be empty")
  // });
  // const { control, handleSubmit } = useForm({
  //   mode: 'onChange',
  //   defaultValues: {
  //     message: ''
  //   },
  //   resolver: yupResolver(schema)
  // });
  //
  const onSubmit = async () => {
    await createAbsence.mutateAsync({
      subjectID: +subjectID,
      absences: [
        {
          date: date.toISOString(),
          studentID: +studentID
        }
      ]
    });

    await absences.refetch();
    setVisible(false);
  };

  const { showActionSheetWithOptions } = useActionSheet();

  if (absences.isPending) {
    return <LoadingView />;
  }

  if (absences.isError) {
    return (
      <ErrorView refetch={absences.refetch} error={absences.error.message} />
    );
  }

  return (
    <>
      {/*<Caption text={'Absences'} />*/}
      <List>
        {
          absences.data.map((absence) => (
            <ListItem
              shouldPress={false}
              key={absence.id}
              text={''}
              leftComponent={
                <View
                  style={tw`shrink grow flex-col items-start justify-between`}
                >
                  <Text
                    style={tw`text-base font-bold leading-tight text-primary-800 dark:text-primary-50`}
                  >
                    {formatShortDate(absence.date)}
                    {/*{absence.date}*/}
                    {/*{new Date().toISOString()}*/}
                  </Text>
                  {absence?.reason ? (
                    <Text
                      style={tw`shrink text-base font-bold text-primary-500 dark:text-primary-300`}
                    >
                      {absence.reason}
                    </Text>
                  ) : null}
                  {absence.excused ? (
                    <View style={tw`flex-row items-center justify-end gap-1`}>
                      <Ionicons
                        name={'checkmark-circle'}
                        size={18}
                        color={
                          tw.prefixMatch('dark')
                            ? tw.color('green-400')
                            : tw.color('green-500')
                        }
                      />
                      <Text
                        style={tw`text-sm font-bold leading-tight text-green-500 dark:text-green-400`}
                      >
                        <Trans>Excused</Trans>
                      </Text>
                    </View>
                  ) : (
                    <View style={tw`flex-row items-center justify-end gap-1`}>
                      <Ionicons
                        name={'close-circle'}
                        size={18}
                        color={
                          tw.prefixMatch('dark')
                            ? tw.color('red-400')
                            : tw.color('red-500')
                        }
                      />
                      <Text
                        style={tw`text-sm font-bold leading-tight text-red-500 dark:text-red-400`}
                      >
                        <Trans>Unexcused</Trans>
                      </Text>
                    </View>
                  )}
                </View>
              }
              rightComponent={
                <View style={tw`flex-row items-center justify-center`}>
                  {/*<IconButton*/}
                  {/*  icon={'create'}*/}
                  {/*  onPress={() => {}}*/}
                  {/*  color={*/}
                  {/*    tw.prefixMatch('dark')*/}
                  {/*      ? tw.color('primary-200')*/}
                  {/*      : tw.color('primary-700')*/}
                  {/*  }*/}
                  {/*/>*/}
                  {!absence.excused &&
                    new Date(absence.date).toLocaleDateString() ===
                      new Date().toLocaleDateString() && (
                      <IconButton
                        icon={'trash'}
                        onPress={() => {
                          showActionSheetWithOptions(
                            {
                              options: [t`Delete`, t`Cancel`],
                              cancelButtonIndex: 1,
                              destructiveButtonIndex: 0,
                              title: t`Are you sure you want to delete this absence?`
                            },
                            (buttonIndex) => {
                              if (buttonIndex === 0) {
                                LocalAuthentication.authenticateAsync({
                                  promptMessage: t`Authenticate to delete absence`
                                }).then(async (res) => {
                                  if (res.success) {
                                    await deleteAbsence.mutateAsync({
                                      subjectID: +subjectID,
                                      absences: [absence.id]
                                    });
                                    await absences.refetch();
                                  }
                                });
                              }
                            }
                          );
                        }}
                        color={
                          tw.prefixMatch('dark')
                            ? tw.color('red-400')
                            : tw.color('red-500')
                        }
                      />
                    )}
                </View>
              }
            />
          )) as any
        }
        <ListItem
          text={''}
          leftComponent={
            <>
              <LargeButton
                iconName={'add'}
                text={t`Add absence`}
                onPress={() => {
                  setVisible(true);
                }}
                style={'grow'}
              />

              <GeneralModal
                title={t`Add absence for ${studentName}`}
                visible={visible}
                setVisible={setVisible}
              >
                <Caption text={t`Date`} />
                <DatePicker
                  style={tw`self-center`}
                  mode='date'
                  date={date}
                  onDateChange={setDate}
                  maximumDate={new Date()}
                />
                {/*<Caption text={'Reason'} />*/}
                {/*<FormInput*/}
                {/*  inModal={true}*/}
                {/*  control={control}*/}
                {/*  name={'message'}*/}
                {/*  placeholder={'Reason for the grade...'}*/}
                {/*  secureTextEntry={false}*/}
                {/*  inputAccessoryViewID={''}*/}
                {/*  errorText={'Reason is required'}*/}
                {/*  contentType={''}*/}
                {/*  flex1={false}*/}
                {/*/>*/}
                <LargeButton
                  text={t`Add absence`}
                  onPress={() => {
                    showActionSheetWithOptions(
                      {
                        options: [t`Add`, t`Cancel`],
                        cancelButtonIndex: 1,
                        title: t`Are you sure you want to add this absence?`
                      },
                      (buttonIndex) => {
                        if (buttonIndex === 0) {
                          LocalAuthentication.authenticateAsync({
                            promptMessage: t`Authenticate to add grade`
                          }).then(async (res) => {
                            if (res.success) {
                              await onSubmit();
                            }
                          });
                        }
                      }
                    );
                  }}
                  style={'mt-4'}
                  symbol={{
                    name: 'faceid',
                    fallback: 'fingerprint'
                  }}
                />
              </GeneralModal>
            </>
          }
          rightComponent={<></>}
        />
      </List>
    </>
  );
}
