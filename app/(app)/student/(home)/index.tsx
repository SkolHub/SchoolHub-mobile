import { RefreshControl, ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import Caption from '@/components/caption';
import SubjectCard from '@/components/subject-card';
import tw from '@/lib/tailwind';
import { useGetStudentSubjects } from '@/api/subject';
import LoadingView from '@/components/loading-view';
import React from 'react';
import ErrorView from '@/components/error-view';

export default function Index() {
  const subjects = useGetStudentSubjects();

  if (subjects.isPending) {
    return <LoadingView />;
  }

  if (subjects.isError) {
    return (
      <ErrorView refetch={subjects.refetch} error={subjects.error.message} />
    );
  }

  subjects.data.map((class_) => {
    class_.subjects = class_.subjects.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
  });

  subjects.data = subjects.data.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });

  return (
    <>
      <ScrollView
        style={tw`flex-1 bg-secondary-100 dark:bg-primary-950`}
        contentContainerStyle={tw`px-4`}
        refreshControl={
          <RefreshControl
            refreshing={subjects.isPending}
            onRefresh={subjects.refetch}
          />
        }
      >
        {subjects.data?.map((class_) => (
          <View key={class_.id}>
            <Caption text={class_.name} key={class_.name} />
            <View style={tw`gap-3`}>
              {class_.subjects.map((subject, index) => (
                <SubjectCard
                  name={subject.name}
                  icon={subject.icon}
                  secondaryText={(subject.teachers ?? [])
                    .map((teacher) => teacher.name)
                    .join(', ')}
                  onPress={() => {
                    router.push({
                      pathname: '/student/subject',
                      params: {
                        subjectID: subject.id
                      }
                    });
                  }}
                  key={index}
                />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </>
  );
}
