import tw from '@/lib/tailwind';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { useGetStudents } from '@/api/subject';
import { router, useGlobalSearchParams } from 'expo-router';
import LoadingView from '@/components/loading-view';
import React from 'react';
import ErrorView from '@/components/error-view';
import List from '@/components/list';
import ListItem from '@/components/list-item';

export default function Students() {
  const { subjectID } = useGlobalSearchParams();
  const students = useGetStudents(subjectID as string);

  if (students.isPending) {
    return <LoadingView />;
  }

  if (students.isError) {
    return (
      <ErrorView
        refetch={students.refetch}
        error={students.error?.message ?? ''}
      />
    );
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={students.isFetching}
          onRefresh={students.refetch}
        />
      }
      style={tw`bg-secondary-100 px-4 dark:bg-primary-950`}
    >
      <List>
        {students.data.map((student) => (
          <ListItem
            text={student.student.name}
            key={student.student.id}
            onPress={() => {
              router.push({
                pathname: '/modals/student-classbook',
                params: {
                  studentID: student.student.id,
                  subjectID,
                  studentName: student.student.name
                }
              });
            }}
            rightComponent={
              <View style={tw`flex-row gap-4`}>
                <View style={tw`items-center justify-center`}>
                  <Text
                    style={tw`text-base font-medium leading-tight tracking-widest text-primary-900 dark:text-primary-100`}
                  >
                    {student.count}/{'3'}
                  </Text>
                  <Text
                    style={tw`text-xs font-medium leading-tight text-primary-700 dark:text-primary-300`}
                  >
                    grades
                  </Text>
                </View>
                <View style={tw`items-center justify-center`}>
                  <Text
                    style={tw`text-base font-medium leading-tight text-primary-900 dark:text-primary-100`}
                  >
                    {(+student.average).toFixed(2)}
                  </Text>
                  <Text
                    style={tw`text-xs font-medium leading-tight text-primary-700 dark:text-primary-300`}
                  >
                    average
                  </Text>
                </View>
              </View>
            }
          />
        ))}
      </List>
    </ScrollView>
  );
}
