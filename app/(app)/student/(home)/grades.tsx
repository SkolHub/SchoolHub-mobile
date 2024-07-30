import { RefreshControl, ScrollView, Text, View } from 'react-native';
import React from 'react';
import tw from '@/lib/tailwind';
import LoadingView from '@/components/loading-view';
import ErrorView from '@/components/error-view';
import { useGetStudentSubjectsWithStats } from '@/api/subject';
import Caption from '@/components/caption';
import List from '@/components/list';
import ListItem from '@/components/list-item';
import { router } from 'expo-router';
import { Trans } from '@lingui/macro';

export default function Index() {
  const subjects = useGetStudentSubjectsWithStats();

  if (subjects.isPending) {
    return <LoadingView />;
  }

  if (subjects.isError) {
    return (
      <ErrorView refetch={subjects.refetch} error={subjects.error.message} />
    );
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={subjects.isPending}
          onRefresh={subjects.refetch}
        />
      }
      style={tw`flex-1 bg-secondary-100 px-4 dark:bg-primary-950`}
    >
      {subjects.data.map((class_) => (
        <View key={class_.id}>
          <Caption text={class_.name} key={class_.name} />
          <List>
            {class_.subjects.map((subject, index) => (
              <ListItem
                onPress={() => {
                  router.push({
                    pathname: '/modals/classbook-subject',
                    params: {
                      subjectID: subject.id,
                      subjectName: subject.name
                    }
                  });
                }}
                text={subject.name}
                textStyle={`font-semibold text-primary-800 text-base dark:text-primary-50`}
                key={index}
                rightComponent={
                  <View style={tw`flex-row gap-4`}>
                    <View style={tw`items-center justify-center`}>
                      <Text
                        style={tw`text-base font-bold leading-tight tracking-widest text-primary-700 dark:text-primary-100`}
                      >
                        {subject.grades}/{subject.metadata.minGrades}
                      </Text>
                      <Text
                        style={tw`text-xs font-bold leading-tight text-primary-500 dark:text-primary-300`}
                      >
                        <Trans>grades</Trans>
                      </Text>
                    </View>
                    {subject.average && (
                      <View style={tw`items-center justify-center`}>
                        <Text
                          style={tw`text-base font-bold leading-tight text-primary-700 dark:text-primary-100`}
                        >
                          {subject.average.toFixed(2)}
                        </Text>
                        <Text
                          style={tw`text-xs font-bold leading-tight text-primary-500 dark:text-primary-300`}
                        >
                          <Trans>average</Trans>
                        </Text>
                      </View>
                    )}
                  </View>
                }
              />
            ))}
          </List>
        </View>
      ))}
    </ScrollView>
  );
}
