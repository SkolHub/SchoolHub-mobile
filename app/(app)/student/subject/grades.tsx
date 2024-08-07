import { View } from 'react-native';
import { useGlobalSearchParams } from 'expo-router';
import tw from '@/lib/tailwind';
import React from 'react';
import StudentSubjectGradesView from '@/components/student-subject-grades-view';

export default function Grades() {
  const { subjectID } = useGlobalSearchParams();

  return (
    <View style={tw`flex-1 bg-secondary-100 px-4 dark:bg-primary-950`}>
      <StudentSubjectGradesView subjectID={+(subjectID as string)} />
    </View>
  );
}
