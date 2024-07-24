import { Pressable, ScrollView, Text } from 'react-native';
import ListItem from '@/components/list-item';
import List from '@/components/list';
import tw from '@/lib/tailwind';
import React, { useEffect, useState } from 'react';
import LargeButton from '@/components/large-button';
import Caption from '@/components/caption';
import { router, useLocalSearchParams } from 'expo-router';
import { SubjectStudent, useGetStudents } from '@/api/subject';
import LoadingView from '@/components/loading-view';
import ErrorView from '@/components/error-view';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import GeneralModal from '@/components/general-modal';
import GradePicker from '@/components/grade-picker';
import FormInput from '@/components/form-input';
import DatePicker from 'react-native-date-picker';
import { BatchGrades, useCreateGrades } from '@/api/grade';
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as LocalAuthentication from 'expo-local-authentication';

export default function GradeMode() {
  const { subjectID } = useLocalSearchParams();

  const studentsData = useGetStudents(subjectID as string);
  const createGrades = useCreateGrades();

  const [studentGrades, setStudentGrades] = useState<
    {
      student: SubjectStudent;
      grade: number | null;
    }[]
  >();

  const [visibleID, setVisibleID] = useState(-1);
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [date, setDate] = useState(new Date());

  const { showActionSheetWithOptions } = useActionSheet();

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
  const onSubmit = async (values: any) => {
    let gradesObject: BatchGrades = {
      grades: [],
      subjectID: +(subjectID as string)
    };

    studentGrades?.forEach((student) => {
      if (student.grade) {
        gradesObject.grades.push({
          studentID: student.student.student.id,
          value: student.grade.toString(),
          reason: values.message ?? '',
          date: date.toISOString()
        });
      }
    });
    console.log(gradesObject);

    if (gradesObject.grades.length > 0) {
      await createGrades.mutateAsync(gradesObject);
      router.back();
    }
  };

  useEffect(() => {
    if (studentsData.data) {
      setStudentGrades(
        studentsData.data.map((student) => ({
          student,
          grade: null
        }))
      );
    }
  }, []);

  if (studentsData.isPending) {
    return <LoadingView />;
  }

  if (studentsData.isError) {
    return (
      <ErrorView
        refetch={studentsData.refetch}
        error={studentsData.error.message}
      />
    );
  }

  return (
    <ScrollView
      style={tw`flex-1 bg-secondary-100 px-4 dark:bg-primary-950`}
      contentContainerStyle={tw`pb-20`}
    >
      {studentGrades && (
        <>
          <Caption text={'Reason'} style={`pt-0`} />
          <FormInput
            control={control}
            name={'message'}
            placeholder={'Enter the reason for the grades...'}
            secureTextEntry={false}
            inputAccessoryViewID={'accessory-view'}
            errorText={'Reason is required'}
            contentType={''}
            flex1={false}
          />
          <Caption text={'Date'} />
          <List>
            <ListItem
              text={'Date'}
              rightComponent={
                <Pressable
                  style={tw`rounded-xl bg-neutral-200 px-4 py-2 dark:bg-neutral-600`}
                  onPress={() => setDateModalVisible(true)}
                >
                  <Text
                    style={tw`text-base font-medium text-black/70 dark:text-white/90`}
                  >
                    {date.toLocaleString('ro-RO', {
                      dateStyle: 'short'
                    })}
                  </Text>
                </Pressable>
              }
            />
          </List>
          <Caption text={'Student grades'} />
          <List>
            {studentGrades?.map(({ student, grade }, index) => (
              <ListItem
                key={index}
                text={student.student.name}
                shouldPress={false}
                rightComponent={
                  <>
                    <GeneralModal
                      title={'Add grade'}
                      visible={visibleID === student.student.id}
                      setVisible={() => setVisibleID(-1)}
                      children={
                        <GradePicker
                          value={grade ?? -1}
                          onSelect={(grade) => {
                            setStudentGrades((prev) => {
                              if (prev) {
                                prev[index].grade = grade;
                                return [...prev];
                              }
                              return prev;
                            });
                            setVisibleID(-1);
                          }}
                        />
                      }
                    />
                    <Pressable
                      style={tw`rounded-xl bg-neutral-200 px-4 py-2 dark:bg-neutral-600`}
                      onPress={() => setVisibleID(student.student.id)}
                    >
                      <Text
                        style={tw`text-base font-medium text-black/70 dark:text-white/90`}
                      >
                        {grade ?? 'Add grade'}
                      </Text>
                    </Pressable>
                  </>
                }
              />
            )) ?? []}
          </List>
          <LargeButton
            text={'Add grades'}
            symbol={{
              name: 'faceid',
              fallback: 'fingerprint'
            }}
            onPress={() => {
              showActionSheetWithOptions(
                {
                  options: ['Add', 'Cancel'],
                  cancelButtonIndex: 1,
                  title: 'Are you sure you want to add these grades?'
                },
                (buttonIndex) => {
                  if (buttonIndex === 0) {
                    LocalAuthentication.authenticateAsync({
                      promptMessage: 'Authenticate to add grades'
                    }).then(() => {
                      handleSubmit(onSubmit)();
                    });
                  }
                }
              );
            }}
            style={'mt-4'}
          />
          <GeneralModal
            title={'Date'}
            visible={dateModalVisible}
            setVisible={setDateModalVisible}
          >
            <DatePicker mode='date' date={date} onDateChange={setDate} />
          </GeneralModal>
        </>
      )}
    </ScrollView>
  );
}
