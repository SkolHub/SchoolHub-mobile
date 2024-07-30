import { Pressable, ScrollView, Text } from 'react-native';
import ListItem from '@/components/list-item';
import List from '@/components/list';
import tw from '@/lib/tailwind';
import Stepper from '@/components/stepper';
import React, { useState } from 'react';
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
import { t } from '@lingui/macro';
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as LocalAuthentication from 'expo-local-authentication';

function getRandomStrings(array: any[], count: number): any[] {
  const result = [];
  const tempArray = [...array]; // Create a copy of the array to avoid mutating the original
  for (let i = 0; i < count; i++) {
    if (tempArray.length === 0) {
      break; // Break if there are no more elements to choose from
    }
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    result.push(tempArray[randomIndex]);
    tempArray.splice(randomIndex, 1); // Remove the chosen element from the array
  }
  return result;
}

export default function Assessment() {
  const { subjectID } = useLocalSearchParams();

  const studentsData = useGetStudents(subjectID as string);
  const createGrades = useCreateGrades();

  const [students, setStudents] = useState<number>(1);
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

    // if (values.message) {
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
    // } else {
    //   studentGrades?.forEach((student) => {
    //     if (student.grade) {
    //       gradesObject.grades.push({
    //         studentID: student.student.student.id,
    //         value: student.grade.toString(),
    //         date: date.toISOString(),
    //       });
    //     }
    //   });
    // }

    if (gradesObject.grades.length > 0) {
      await createGrades.mutateAsync(gradesObject);
      router.back();
    }

    // await createGrades.mutateAsync(gradesObject);
    // router.back();
  };

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
    <ScrollView style={tw`flex-1 bg-secondary-100 px-4 dark:bg-primary-950`}>
      {!studentGrades && (
        <>
          <List>
            <ListItem
              text={t`Number of students`}
              shouldPress={false}
              rightComponent={
                <Stepper
                  value={students}
                  onPressMinus={() => {
                    if (students > 1) {
                      setStudents(students - 1);
                    }
                  }}
                  onPressPlus={() => {
                    setStudents(students + 1);
                  }}
                />
              }
            />
          </List>
          <LargeButton
            text={t`Get students`}
            onPress={() => {
              const studentNames = getRandomStrings(
                studentsData.data,
                students
              );
              setStudentGrades(
                studentNames.map((student) => ({ student, grade: null }))
              );
            }}
            style={'mt-4'}
          />
        </>
      )}
      {studentGrades && (
        <>
          <Caption text={t`Student grades`} style={`pt-0`} />
          <List>
            {studentGrades?.map(({ student, grade }, index) => (
              <ListItem
                key={index}
                text={student.student.name}
                shouldPress={false}
                rightComponent={
                  <>
                    <GeneralModal
                      title={t`Add grade`}
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
                        style={tw`text-base font-medium text-black/70 dark:text-white/70`}
                      >
                        {grade ?? t`Add grade`}
                      </Text>
                    </Pressable>
                  </>
                }
              />
            )) ?? []}
          </List>
          <Caption text={t`Reason`} />
          <FormInput
            control={control}
            name={'message'}
            placeholder={t`Enter the reason for the grades...`}
            secureTextEntry={false}
            inputAccessoryViewID={'accessory-view'}
            errorText={t`Reason is required`}
            contentType={''}
            flex1={false}
          />
          <Caption text={'Date'} />
          <List>
            <ListItem
              text={t`Date`}
              rightComponent={
                <Pressable
                  style={tw`rounded-xl bg-neutral-200 px-4 py-2 dark:bg-neutral-600`}
                  onPress={() => setDateModalVisible(true)}
                >
                  <Text
                    style={tw`text-base font-medium text-black/70 dark:text-white/70`}
                  >
                    {date.toLocaleString('ro-RO', {
                      dateStyle: 'short'
                    })}
                  </Text>
                </Pressable>
              }
            />
          </List>
          <LargeButton
            text={t`Add grades`}
            onPress={() => {
              handleSubmit(() =>
                showActionSheetWithOptions(
                  {
                    options: [t`Add`, t`Cancel`],
                    cancelButtonIndex: 1
                  },
                  (index) => {
                    if (index === 0) {
                      LocalAuthentication.authenticateAsync({
                        promptMessage: t`Authenticate to add grades`
                      }).then(async (res) => {
                        if (res.success) {
                          await handleSubmit(onSubmit)();
                        }
                      });
                    }
                  }
                )
              )();
            }}
            style={'mt-4'}
          />
          <GeneralModal
            title={t`Date`}
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
