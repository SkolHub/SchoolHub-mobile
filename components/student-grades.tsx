import {
  useCreateGrades,
  useDeleteGrade,
  useGetStudentGrades
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
import React, { useState } from 'react';
import GradePicker from '@/components/grade-picker';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormInput from '@/components/form-input';
import DatePicker from 'react-native-date-picker';
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as LocalAuthentication from 'expo-local-authentication';
import EditGradeModal from '@/components/edit-grade-modal';

export default function StudentGrades({
  subjectID,
  studentID,
  studentName
}: {
  subjectID: string;
  studentID: string;
  studentName: string;
}) {
  const grades = useGetStudentGrades({
    subjectID: subjectID,
    studentID: studentID
  });
  const createGrade = useCreateGrades();
  const deleteGrade = useDeleteGrade();

  const [visible, setVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [grade, setGrade] = useState(-1);
  const [gradeErr, setGradeErr] = useState(false);

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

  const onSubmit = async (data: any) => {
    await createGrade.mutateAsync({
      subjectID: +subjectID,
      grades: [
        {
          studentID: +studentID,
          value: grade.toString(),
          date: date.toISOString(),
          reason: data.message
        }
      ]
    });

    await grades.refetch();
    setVisible(false);
    console.log(data);
  };

  const [editVisible, setEditVisible] = useState(false);
  const [editGrade, setEditGrade] = useState(-1);
  const [editDate, setEditDate] = useState(new Date());
  const [editReason, setEditReason] = useState('');
  const [editID, setEditID] = useState(-1);

  const { showActionSheetWithOptions } = useActionSheet();

  if (grades.isPending) {
    return <LoadingView />;
  }

  if (grades.isError) {
    return <ErrorView refetch={grades.refetch} error={grades.error.message} />;
  }

  return (
    <>
      <Caption text={'Grades'} style={'pt-0'} />
      <List>
        {
          grades.data.map((grade) => (
            <ListItem
              key={grade.id}
              shouldPress={false}
              text={''}
              leftComponent={
                <View
                  style={tw`shrink grow flex-col items-start justify-between`}
                >
                  <Text
                    style={tw`text-lg font-bold leading-tight text-primary-800 dark:text-primary-50`}
                  >
                    {grade.value}
                  </Text>
                  <Text
                    style={tw`shrink text-base font-bold leading-tight text-primary-500 dark:text-primary-300`}
                  >
                    {formatShortDate(grade.date)}
                  </Text>
                  {grade?.reason ? (
                    <Text
                      style={tw`shrink text-base font-bold leading-tight text-primary-500 dark:text-primary-300`}
                    >
                      {grade.reason}
                    </Text>
                  ) : null}
                </View>
              }
              rightComponent={
                <>
                  <View style={tw`flex-row items-center justify-center`}>
                    <IconButton
                      icon={'create'}
                      onPress={() => {
                        setEditDate(new Date(grade.date));
                        setEditGrade(+grade.value);
                        setEditVisible(true);
                        setEditReason(grade.reason);
                        setEditID(grade.id);
                      }}
                      color={
                        tw.prefixMatch('dark')
                          ? tw.color('primary-200')
                          : tw.color('primary-700')
                      }
                    />
                    <IconButton
                      icon={'trash'}
                      onPress={async () => {
                        showActionSheetWithOptions(
                          {
                            options: ['Delete', 'Cancel'],
                            cancelButtonIndex: 1,
                            destructiveButtonIndex: 0,
                            title: 'Are you sure you want to delete this grade?'
                          },
                          (buttonIndex) => {
                            if (buttonIndex === 0) {
                              LocalAuthentication.authenticateAsync({
                                promptMessage: 'Authenticate to delete grade'
                              }).then(async () => {
                                await deleteGrade.mutateAsync({
                                  subjectID: subjectID,
                                  ids: [grade.id]
                                });
                                await grades.refetch();
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
                </>
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
                text={'Add grade'}
                onPress={() => {
                  setVisible(true);
                }}
                style={'grow'}
              />
              <GeneralModal
                title={`Add grade for ${studentName}`}
                visible={visible}
                setVisible={setVisible}
              >
                <Caption text={'Date'} />
                <DatePicker
                  style={tw`self-center`}
                  mode='date'
                  date={date}
                  onDateChange={setDate}
                  maximumDate={new Date()}
                />
                <Caption text={'Reason'} />
                <FormInput
                  inModal={true}
                  control={control}
                  name={'message'}
                  placeholder={'Reason for the grade...'}
                  secureTextEntry={false}
                  inputAccessoryViewID={''}
                  errorText={'Reason is required'}
                  contentType={''}
                  flex1={false}
                />
                <Caption text={'Grade'} />
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
                    Grade is required
                  </Text>
                )}
                <LargeButton
                  text={'Add grade'}
                  onPress={() => {
                    if (grade === -1) {
                      setGradeErr(true);
                      handleSubmit(() => {})();
                    } else {
                      handleSubmit(() => {
                        showActionSheetWithOptions(
                          {
                            options: ['Add', 'Cancel'],
                            cancelButtonIndex: 1,
                            title: 'Are you sure you want to add this grade?'
                          },
                          (buttonIndex) => {
                            if (buttonIndex === 0) {
                              LocalAuthentication.authenticateAsync({
                                promptMessage: 'Authenticate to add grade'
                              }).then(() => {
                                handleSubmit(onSubmit)();
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
              </GeneralModal>
            </>
          }
          rightComponent={<></>}
        />
      </List>
      <EditGradeModal
        // grade={grade}
        date={editDate.toISOString()}
        id={editID}
        value={editGrade}
        reason={editReason}
        visible={editVisible}
        setVisible={setEditVisible}
        studentName={studentName}
        subjectID={subjectID}
        refetch={grades.refetch}
      />
    </>
  );
}
