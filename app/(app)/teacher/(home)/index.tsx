import { ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import SubjectCard from '@/components/subject-card';
import React from 'react';
import tw from '@/lib/tailwind';
import { useGetTeacherSubjects } from '@/api/subject';
import LoadingView from '@/components/loading-view';
import ErrorView from '@/components/error-view';
import ClassCard from '@/components/class-card';
import { useGetAccountID } from '@/api/account';

export default function Index() {
  const subjects = useGetTeacherSubjects();
  const accountID = useGetAccountID();

  if (subjects.isPending || accountID.isPending) {
    return <LoadingView />;
  }

  if (subjects.isError) {
    return (
      <ErrorView refetch={subjects.refetch} error={subjects.error.message} />
    );
  }

  if (accountID.isError) {
    return (
      <ErrorView refetch={accountID.refetch} error={accountID.error.message} />
    );
  }

  subjects.data = subjects.data.sort((a, b) => {
    if (a.schoolClasses[0].name < b.schoolClasses[0].name) {
      return 1;
    }
    if (a.schoolClasses[0].name > b.schoolClasses[0].name) {
      return -1;
    }
    return 0;
  });

  return (
    <>
      <ScrollView
        style={tw`flex-1 bg-secondary-100 dark:bg-primary-950`}
        contentContainerStyle={tw`px-4`}
      >
        <View style={tw`gap-3`}>
          {subjects.data?.map((class_) => {
            if (class_.subjects.length === 1) {
              return (
                <SubjectCard
                  key={class_.subjects[0].id}
                  name={class_.schoolClasses.map((c) => c.name).join(', ')}
                  icon={class_.subjects[0].icon}
                  secondaryText={class_.subjects[0].name}
                  onPress={() => {
                    router.push({
                      pathname: '/teacher/subject',
                      params: {
                        subjectID: class_.subjects[0].id
                      }
                    });
                  }}
                />
              );
            }

            return (
              <ClassCard
                key={class_.subjects[0].id}
                name={class_.schoolClasses.map((c) => c.name).join(', ')}
                subjects={class_.subjects}
                classMaster={
                  class_.schoolClasses[0].classMasterID == accountID.data
                }
                onPress={() => {
                  router.push({
                    pathname: '/teacher/class-master',
                    params: {
                      classID: class_.schoolClasses[0].id
                    }
                  });
                }}
              />
            );
          })}
        </View>
      </ScrollView>
    </>
  );
}
