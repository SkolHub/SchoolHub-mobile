import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useGetSchoolClass } from '@/api/class-master';
import LoadingView from '@/components/loading-view';
import ErrorView from '@/components/error-view';
import GenericHeader from '@/components/generic-header';
import { RefreshControl, ScrollView } from 'react-native';
import List from '@/components/list';
import ListItem from '@/components/list-item';
import tw from '@/lib/tailwind';
import React from 'react';

export default function Index() {
  const { classID } = useLocalSearchParams();
  const schoolClass = useGetSchoolClass(classID as string);

  if (schoolClass.isPending) {
    return <LoadingView />;
  }

  if (schoolClass.isError) {
    return (
      <ErrorView
        refetch={schoolClass.refetch}
        error={schoolClass.error.message}
      />
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          header: () => (
            <GenericHeader
              text={schoolClass.data.name}
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
            refreshing={schoolClass.isPending}
            onRefresh={schoolClass.refetch}
          />
        }
        style={tw`bg-secondary-100 px-4 dark:bg-primary-950`}
        contentContainerStyle={tw`pb-20`}
      >
        <List>
          {schoolClass.data.students.map((student) => (
            <ListItem
              text={student.student.name}
              key={student.student.id}
              onPress={() => {
                router.push({
                  pathname: '/teacher/class-master/student',
                  params: {
                    studentID: student.student.id,
                    schoolClassID: student.schoolClassID,
                    studentName: student.student.name
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
