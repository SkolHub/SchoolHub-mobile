import { ScrollView, Text, View } from 'react-native';
import tw from '@/lib/tailwind';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { t, Trans } from '@lingui/macro';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import List from '@/components/list';
import ListItem from '@/components/list-item';
import { formatShortDate } from '@/lib/utils';
import { useGetSchoolClassStudent } from '@/api/class-master';
import LoadingView from '@/components/loading-view';
import ErrorView from '@/components/error-view';
import ModalHeader from '@/components/modal-header';
import Ionicons from '@expo/vector-icons/Ionicons';
import IconButton from '@/components/icon-button';
import * as LocalAuthentication from 'expo-local-authentication';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useExcuseAbsences } from '@/api/grade';

export default function StudentClassbook() {
  const { studentID, subjectID, studentName, schoolClassID } =
    useLocalSearchParams();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const studentSubjects = useGetSchoolClassStudent({
    studentID: +(studentID as string),
    schoolClassID: +(schoolClassID as string)
  });
  const excuseAbsence = useExcuseAbsences();

  const { showActionSheetWithOptions } = useActionSheet();

  if (studentSubjects.isPending) {
    return <LoadingView />;
  }

  if (studentSubjects.isError) {
    return (
      <ErrorView
        refetch={studentSubjects.refetch}
        error={studentSubjects.error.message}
      />
    );
  }

  const subject = studentSubjects.data.find((subject) => {
    return subject.id === +(subjectID as string);
  });

  if (subject?.absences) {
    subject.absences = subject.absences.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  if (subject?.grades) {
    subject.grades = subject.grades.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  return (
    <ScrollView
      style={tw`bg-secondary-100 px-4 dark:bg-primary-950`}
      contentContainerStyle={tw`pb-20`}
    >
      <Stack.Screen
        options={{
          header: () => (
            <ModalHeader
              text={studentName as string}
              onPress={() => router.back()}
            />
          )
        }}
      />
      <SegmentedControl
        style={tw`mb-6`}
        values={[t`Grades`, t`Absences`]}
        selectedIndex={selectedIndex}
        onChange={(event) => {
          setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
        }}
      />
      {selectedIndex === 0 ? (
        <List>
          {
            subject?.grades.map((grade) => (
              <ListItem
                key={grade.id + 'grade'}
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
                      style={tw`shrink text-sm font-bold leading-tight text-primary-500 dark:text-primary-300`}
                    >
                      {formatShortDate(grade.date)}
                    </Text>
                    {grade?.reason ? (
                      <Text
                        style={tw`shrink text-sm font-bold leading-tight text-primary-500 dark:text-primary-300`}
                      >
                        {grade.reason}
                      </Text>
                    ) : null}
                  </View>
                }
                rightComponent={<View></View>}
              />
            )) as any
          }
        </List>
      ) : (
        <List>
          {
            subject?.absences.map((absence) => (
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
                  <View>
                    {absence.excused ? null : (
                      <IconButton
                        icon={'checkmark-circle'}
                        onPress={() => {
                          showActionSheetWithOptions(
                            {
                              options: [t`Excuse`, t`Cancel`],
                              cancelButtonIndex: 1,
                              title: t`Are you sure you want to excuse this absence?`
                            },
                            (buttonIndex) => {
                              if (buttonIndex === 0) {
                                LocalAuthentication.authenticateAsync({
                                  promptMessage: t`Authenticate to excuse absence`
                                }).then(async (res) => {
                                  if (res.success) {
                                    await excuseAbsence.mutateAsync({
                                      subjectID: +(subjectID as string),
                                      absences: [absence.id]
                                    });
                                    await studentSubjects.refetch();
                                  }
                                });
                              }
                            }
                          );
                        }}
                        color={
                          tw.prefixMatch('dark')
                            ? tw.color('primary-200')
                            : tw.color('primary-700')
                        }
                      />
                    )}
                  </View>
                }
              />
            )) as any
          }
        </List>
      )}
    </ScrollView>
  );
}
