import { View } from 'react-native';
import { useGlobalSearchParams } from 'expo-router';
import tw from '@/lib/tailwind';
import React from 'react';
import StudentSubjectAbsencesView from '@/components/student-subject-absences-view';

export default function Absences() {
  const { subjectID } = useGlobalSearchParams();
  return (
    <View style={tw`flex-1 bg-secondary-100 px-4 dark:bg-primary-950`}>
      <StudentSubjectAbsencesView subjectID={+(subjectID as string)} />
    </View>
  );
}
