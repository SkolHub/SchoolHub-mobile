import GeneralModal from '@/components/general-modal';
import Caption from '@/components/caption';
import tw from '@/lib/tailwind';
import FormInput from '@/components/form-input';
import GradePicker from '@/components/grade-picker';
import { Text } from 'react-native';
import LargeButton from '@/components/large-button';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Grade, useUpdateGrade } from '@/api/grade';
import * as LocalAuthentication from 'expo-local-authentication';
import { useActionSheet } from '@expo/react-native-action-sheet';
import List from '@/components/list';
import ListItem from '@/components/list-item';
import { formatShortDate } from '@/lib/utils';
import { t, Trans } from '@lingui/macro';

export default function EditGradeModal({
  subjectID,
  studentName,
  visible,
  setVisible,
  // grade,
  value,
  date,
  reason,
  id,
  refetch
}: {
  subjectID: string;
  studentName: string;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  // grade: Grade;
  value: number;
  date: string;
  reason: string;
  id: number;
  refetch: () => Promise<any>;
}) {
  const updateGrade = useUpdateGrade();

  // const [editGrade, setEditGrade] = useState(+grade.value);
  // const [editDate, setEditDate] = useState(new Date(grade.date));
  // const [gradeErr, setGradeErr] = useState(false);

  const [editGrade, setEditGrade] = useState(value);
  const [editDate, setEditDate] = useState(new Date(date));
  const [gradeErr, setGradeErr] = useState(false);

  const schema = yup.object().shape({
    message: yup.string().required("Reason can't be empty")
  });
  const { control, handleSubmit, setValue } = useForm({
    mode: 'onChange',
    defaultValues: {
      message: reason
    },
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: { message: string }) => {
    await updateGrade.mutateAsync({
      grade: {
        value: editGrade.toString(),
        reason: data.message
      },
      // id: grade.id,
      id,
      subjectID
    });

    await refetch();
    setVisible(false);
  };

  const { showActionSheetWithOptions } = useActionSheet();

  useEffect(() => {
    setEditGrade(value);
    setEditDate(new Date(date));
    setValue('message', reason);
  }, [visible]);

  return (
    <GeneralModal
      title={t`Edit grade for ${studentName}`}
      visible={visible}
      setVisible={setVisible}
    >
      <Caption text={t`Date`} />
      <List>
        <ListItem
          text={t`Date`}
          backgroundColor={'bg-neutral-100 dark:bg-neutral-600'}
          shouldPress={false}
          rightComponent={
            <Text
              style={tw`text-base font-medium text-neutral-400 dark:text-neutral-400`}
            >
              {formatShortDate(date)}
            </Text>
          }
        />
      </List>
      <Caption text={t`Reason`} />
      <FormInput
        inModal={true}
        control={control}
        name={'message'}
        placeholder={t`Reason for the grade...`}
        secureTextEntry={false}
        inputAccessoryViewID={''}
        errorText={t`Reason is required`}
        contentType={''}
        flex1={false}
      />
      <Caption text={t`Grade`} />
      <GradePicker
        value={editGrade}
        onSelect={(value) => {
          setEditGrade(value);
          setGradeErr(false);
        }}
        style={gradeErr ? 'border border-red-500 dark:border-red-400' : ''}
      />
      {gradeErr && (
        <Text style={tw`text-red-500 dark:text-red-400`}>
          <Trans>Grade is required</Trans>
        </Text>
      )}
      <LargeButton
        text={t`Change grade`}
        onPress={() => {
          handleSubmit(() => {
            showActionSheetWithOptions(
              {
                options: [t`Change`, t`Cancel`],
                cancelButtonIndex: 1,
                title: t`Are you sure you want to change this grade?`
              },
              (buttonIndex) => {
                if (buttonIndex === 0) {
                  LocalAuthentication.authenticateAsync({
                    promptMessage: t`Authenticate to change grade`
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
  );
}
