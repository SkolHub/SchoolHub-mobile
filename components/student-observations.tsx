import {
  useCreateObservations,
  useDeleteObservations,
  useGetStudentObservations
} from '@/api/grade';
import LoadingView from '@/components/loading-view';
import ErrorView from '@/components/error-view';
import { Text, View } from 'react-native';
import tw from '@/lib/tailwind';
import List from '@/components/list';
import ListItem from '@/components/list-item';
import { formatShortDate } from '@/lib/utils';
import Caption from '@/components/caption';
import IconButton from '@/components/icon-button';
import LargeButton from '@/components/large-button';
import GeneralModal from '@/components/general-modal';
import { useState } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import FormInput from '@/components/form-input';
import { t } from '@lingui/macro';

export default function StudentObservations({
  subjectID,
  studentID,
  studentName
}: {
  subjectID: string;
  studentID: string;
  studentName: string;
}) {
  const createObservation = useCreateObservations();
  const deleteObservation = useDeleteObservations();

  const observations = useGetStudentObservations({
    subjectID: subjectID as string,
    studentID: studentID as string
  });

  const [visible, setVisible] = useState(false);
  const [date, setDate] = useState(new Date());

  const schema = yup.object().shape({
    message: yup.string().required("Reason can't be empty")
  });
  const { control, handleSubmit } = useForm({
    mode: 'onChange',
    defaultValues: {
      message: ''
    },
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: { message: string }) => {
    await createObservation.mutateAsync({
      subjectID: +subjectID,
      observations: [
        {
          reason: data.message,
          studentID: +studentID
        }
      ]
    });

    await observations.refetch();
    setVisible(false);
  };

  const { showActionSheetWithOptions } = useActionSheet();

  if (observations.isPending) {
    return <LoadingView />;
  }

  if (observations.isError) {
    return (
      <ErrorView
        refetch={observations.refetch}
        error={observations.error.message}
      />
    );
  }

  return (
    <>
      <List>
        {
          observations.data.map((observation) => (
            <ListItem
              shouldPress={false}
              key={observation.id}
              text={''}
              leftComponent={
                <View
                  style={tw`shrink grow flex-col items-start justify-between`}
                >
                  <Text
                    style={tw`text-base font-bold leading-tight text-primary-800 dark:text-primary-50`}
                  >
                    {observation.reason}
                  </Text>
                  <Text
                    style={tw`shrink text-sm font-bold text-primary-500 dark:text-primary-300`}
                  >
                    {formatShortDate(observation.timestamp)}
                  </Text>
                </View>
              }
              rightComponent={
                <View style={tw`flex-row items-center justify-center`}>
                  <IconButton
                    icon={'create'}
                    onPress={() => {}}
                    color={
                      tw.prefixMatch('dark')
                        ? tw.color('primary-200')
                        : tw.color('primary-700')
                    }
                  />
                  <IconButton
                    icon={'trash'}
                    onPress={() => {
                      showActionSheetWithOptions(
                        {
                          options: [t`Delete`, t`Cancel`],
                          cancelButtonIndex: 1,
                          destructiveButtonIndex: 0,
                          title: t`Are you sure you want to delete this observation?`
                        },
                        (buttonIndex) => {
                          if (buttonIndex === 0) {
                            LocalAuthentication.authenticateAsync({
                              promptMessage: t`Authenticate to delete observation`
                            }).then(async (res) => {
                              if (res.success) {
                                await deleteObservation.mutateAsync([
                                  observation.id
                                ]);
                                await observations.refetch();
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
                text={t`Add observation`}
                onPress={() => {
                  setVisible(true);
                }}
                style={'grow'}
              />

              <GeneralModal
                title={t`Add observation for ${studentName}`}
                visible={visible}
                setVisible={setVisible}
              >
                <Caption text={'Reason'} style={'pt-0'} />
                <FormInput
                  control={control}
                  name={'message'}
                  placeholder={t`Reason`}
                  secureTextEntry={false}
                  inputAccessoryViewID={''}
                  errorText={t`Reason is required`}
                  contentType={''}
                  flex1={false}
                  inModal={true}
                />
                <LargeButton
                  text={t`Add observation`}
                  onPress={() => {
                    handleSubmit(() => {
                      showActionSheetWithOptions(
                        {
                          options: [t`Add`, t`Cancel`],
                          cancelButtonIndex: 1,
                          title: t`Are you sure you want to add this observation?`
                        },
                        (buttonIndex) => {
                          if (buttonIndex === 0) {
                            LocalAuthentication.authenticateAsync({
                              promptMessage: t`Authenticate to add observation`
                            }).then((res) => {
                              if (res.success) {
                                handleSubmit(onSubmit)();
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
              </GeneralModal>
            </>
          }
          rightComponent={<></>}
        />
      </List>
    </>
  );
}
