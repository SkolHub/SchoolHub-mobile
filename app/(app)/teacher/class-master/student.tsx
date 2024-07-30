import { router, Stack, useGlobalSearchParams } from 'expo-router';
import { useGetSchoolClassStudent } from '@/api/class-master';
import LoadingView from '@/components/loading-view';
import ErrorView from '@/components/error-view';
import GenericHeader from '@/components/generic-header';
import { RefreshControl, ScrollView } from 'react-native';
import tw from '@/lib/tailwind';
import React from 'react';
import List from '@/components/list';
import ListItem from '@/components/list-item';

export default function Student() {
  const { studentID, schoolClassID, studentName } = useGlobalSearchParams();
  const schoolClassStudent = useGetSchoolClassStudent({
    studentID: +(studentID as string),
    schoolClassID: +(schoolClassID as string)
  });

  if (schoolClassStudent.isPending) {
    return <LoadingView />;
  }

  if (schoolClassStudent.isError) {
    return (
      <ErrorView
        refetch={schoolClassStudent.refetch}
        error={JSON.stringify(schoolClassStudent.error.message)}
      />
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          header: () => (
            <GenericHeader
              text={studentName as string}
              onPress={() => {
                router.back();
              }}
            />
          )
        }}
      />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={schoolClassStudent.isPending}
            onRefresh={schoolClassStudent.refetch}
          />
        }
        style={tw`bg-secondary-100 px-4 dark:bg-primary-950`}
        contentContainerStyle={tw`pb-20`}
      >
        <List>
          {schoolClassStudent.data.map((subject) => (
            <ListItem
              text={subject.name}
              key={subject.id}
              onPress={() => {
                router.push({
                  pathname: '/teacher/class-master/student-classbook',
                  params: {
                    studentID,
                    subjectID: subject.id,
                    studentName,
                    schoolClassID
                  }
                });
              }}
            />
          ))}
        </List>
      </ScrollView>
    </>
  );
}
