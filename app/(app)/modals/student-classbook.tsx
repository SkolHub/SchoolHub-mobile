import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useGetStudentAbsences, useGetStudentGrades } from '@/api/grade';
import LoadingView from '@/components/loading-view';
import ErrorView from '@/components/error-view';
import { ScrollView, Text, View } from 'react-native';
import ModalHeader from '@/components/modal-header';
import tw from '@/lib/tailwind';
import List from '@/components/list';
import ListItem from '@/components/list-item';
import { formatShortDate } from '@/lib/utils';
import Ionicons from '@expo/vector-icons/Ionicons';
import Caption from '@/components/caption';
import IconButton from '@/components/icon-button';
import LargeButton from '@/components/large-button';

export default function StudentClassbook() {
  const { studentID, subjectID, studentName } = useLocalSearchParams();
  const grades = useGetStudentGrades({
    subjectID: subjectID as string,
    studentID: studentID as string
  });
  const absences = useGetStudentAbsences({
    subjectID: subjectID as string,
    studentID: studentID as string
  });

  if (grades.isPending || absences.isPending) {
    return <LoadingView />;
  }

  if (grades.isError) {
    return <ErrorView refetch={grades.refetch} error={grades.error.message} />;
  }

  if (absences.isError) {
    return (
      <ErrorView refetch={absences.refetch} error={absences.error.message} />
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          header: () => (
            <ModalHeader
              text={studentName as string}
              onPress={() => {
                router.back();
              }}
            />
          )
        }}
      />

      <ScrollView
        style={tw`bg-secondary-100 px-4 dark:bg-primary-950`}
        contentContainerStyle={tw`pb-20`}
      >
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
                      {grade.id}
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
                      onPress={() => {}}
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
              <LargeButton
                iconName={'add'}
                text={'Add grade'}
                onPress={() => {}}
                style={'grow'}
              />
            }
            rightComponent={<></>}
          />
        </List>
        <Caption text={'Absences'} />
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
                      style={tw`text-lg font-bold leading-tight text-primary-800 dark:text-primary-50`}
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
                          Excused
                        </Text>
                      </View>
                    ) : (
                      <View style={tw`flex-row items-center justify-end gap-1`}>
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
                          Unexcused
                        </Text>
                      </View>
                    )}
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
                      onPress={() => {}}
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
              <LargeButton
                iconName={'add'}
                text={'Add absence'}
                onPress={() => {}}
                style={'grow'}
              />
            }
            rightComponent={<></>}
          />
        </List>
      </ScrollView>
    </>
  );
}
