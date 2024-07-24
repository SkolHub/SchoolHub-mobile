import { useGetStudents } from '@/api/subject';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import LoadingView from '@/components/loading-view';
import ErrorView from '@/components/error-view';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import tw from '@/lib/tailwind';
import StatsSummaryView from '@/components/stats-summary-view';
import LargeButton from '@/components/large-button';
import * as Progress from 'react-native-progress';
import ModalHeader from '@/components/modal-header';
import List from '@/components/list';
import ListItem from '@/components/list-item';
import Ionicons from '@expo/vector-icons/Ionicons';
import Caption from '@/components/caption';
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as LocalAuthentication from 'expo-local-authentication';
import { useCreateAbsences } from '@/api/grade';

export default function AttendanceMode() {
  const { subjectID } = useLocalSearchParams();

  const studentsData = useGetStudents(subjectID as string);
  const createAbsences = useCreateAbsences();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [absenceData, setAbsenceData] = useState<
    {
      studentID: number;
      date: string;
    }[]
  >([]);

  const { showActionSheetWithOptions } = useActionSheet();

  if (studentsData.isPending) {
    return <LoadingView />;
  }

  if (studentsData.isError) {
    return (
      <ErrorView
        refetch={studentsData.refetch}
        error={studentsData.error?.message ?? ''}
      />
    );
  }

  studentsData.data = studentsData.data.sort((a, b) =>
    a.student.name.localeCompare(b.student.name)
  );

  return (
    <>
      <Stack.Screen
        options={{
          presentation: 'modal',
          header: () => (
            <ModalHeader
              text='Attendance mode'
              onPress={() => {
                router.back();
              }}
            />
          )
        }}
      />
      <ScrollView
        style={tw`flex-1 bg-secondary-100 px-4 dark:bg-primary-950`}
        contentContainerStyle={tw`pb-20`}
      >
        {currentIdx < studentsData.data.length && (
          <View>
            <View
              style={tw`mb-4 items-stretch rounded-3xl bg-neutral-50 p-4 dark:bg-neutral-700`}
            >
              <Text
                style={tw`text-2xl font-bold text-primary-900 dark:text-primary-50`}
              >
                {studentsData.data[currentIdx].student.name}
              </Text>
              <Text
                style={tw`mt-0.5 text-lg font-medium text-primary-900 dark:text-primary-50`}
              >
                {currentIdx + 1} of {studentsData.data.length} students
              </Text>
              <Progress.Bar
                progress={(currentIdx + 1) / studentsData.data.length}
                width={null}
                height={12}
                borderRadius={100}
                color={
                  tw.prefixMatch('dark')
                    ? tw.color('secondary-400')
                    : tw.color('secondary-500')
                }
                unfilledColor={
                  tw.prefixMatch('dark')
                    ? tw.color('neutral-500')
                    : tw.color('neutral-300')
                }
                borderWidth={0}
                style={tw`mt-1`}
              />
            </View>
            <StatsSummaryView
              style={'w-full'}
              data={[
                {
                  grades: studentsData.data[currentIdx].count
                },
                {
                  average: (+studentsData.data[currentIdx].average)
                    .toFixed(2)
                    .toString()
                }
              ]}
            />
            <View
              style={tw`mt-4 items-stretch gap-3 rounded-3xl bg-neutral-50 px-4 py-6 dark:bg-neutral-700`}
            >
              <LargeButton
                text={'Present'}
                contentContainerStyle={'bg-green-500/40 dark:bg-green-400/60'}
                textStyle={'text-neutral-900 dark:text-neutral-50'}
                style={'w-full'}
                onPress={() => {
                  setCurrentIdx(currentIdx + 1);
                }}
              />
              <LargeButton
                text={'Absent'}
                contentContainerStyle={'bg-red-500/40 dark:bg-red-400/70'}
                textStyle={'text-neutral-900 dark:text-neutral-50'}
                style={'w-full'}
                onPress={() => {
                  setAbsenceData([
                    ...absenceData,
                    {
                      studentID: studentsData.data[currentIdx].student.id,
                      date: new Date().toISOString()
                    }
                  ]);
                  setCurrentIdx(currentIdx + 1);
                }}
              />
            </View>
          </View>
        )}
        {currentIdx >= studentsData.data.length && (
          <>
            <Caption text={'Finish up'} style={'pt-0'} />
            <List>
              {studentsData.data.map((student) => (
                <ListItem
                  text={student.student.name}
                  shouldPress={false}
                  key={student.student.id}
                  rightComponent={
                    <View
                      style={tw`rounded-2xl bg-neutral-200/70 px-4 py-3 dark:bg-neutral-600`}
                    >
                      {absenceData.find(
                        (absence) => absence.studentID === student.student.id
                      ) ? (
                        <Pressable
                          style={tw`flex-row items-center justify-end gap-1`}
                          onPress={() => {
                            setAbsenceData((prev) =>
                              prev.filter(
                                (absence) =>
                                  absence.studentID !== student.student.id
                              )
                            );
                          }}
                        >
                          <Ionicons
                            name={'close-circle'}
                            size={20}
                            color={
                              tw.prefixMatch('dark')
                                ? tw.color('red-400')
                                : tw.color('red-500')
                            }
                          />
                          <Text
                            style={tw`text-base font-bold leading-tight text-red-500 dark:text-red-400`}
                          >
                            Absent
                          </Text>
                        </Pressable>
                      ) : (
                        <Pressable
                          style={tw`flex-row items-center justify-end gap-1`}
                          onPress={() => {
                            setAbsenceData([
                              ...absenceData,
                              {
                                studentID: student.student.id,
                                date: new Date().toISOString()
                              }
                            ]);
                          }}
                        >
                          <Ionicons
                            name={'checkmark-circle'}
                            size={20}
                            color={
                              tw.prefixMatch('dark')
                                ? tw.color('green-400')
                                : tw.color('green-500')
                            }
                          />
                          <Text
                            style={tw`text-base font-bold leading-tight text-green-500 dark:text-green-400`}
                          >
                            Present
                          </Text>
                        </Pressable>
                      )}
                    </View>
                  }
                />
              ))}
            </List>
            <LargeButton
              text={'Add absences'}
              symbol={{
                name: 'faceid',
                fallback: 'fingerprint'
              }}
              onPress={() => {
                showActionSheetWithOptions(
                  {
                    options: ['Cancel', 'Add absences'],
                    cancelButtonIndex: 0
                  },
                  async (buttonIndex) => {
                    if (buttonIndex === 1) {
                      await LocalAuthentication.authenticateAsync({
                        promptMessage: 'Authenticate to add absences'
                      }).then(async () => {
                        await createAbsences.mutateAsync(
                          {
                            subjectID: +(subjectID as string),
                            absences: absenceData
                          },
                          {
                            onSuccess: () => {
                              router.back();
                            }
                          }
                        );
                      });
                    }
                  }
                );
              }}
              style={'mt-4'}
            />
          </>
        )}
      </ScrollView>
    </>
  );
}
