import { View } from 'react-native';
import { useGlobalSearchParams } from 'expo-router';
import tw from '@/lib/tailwind';
import React from 'react';
import SubjectAbsencesView from '@/components/subject-absences-view';

export default function Absences() {
  const { subjectID } = useGlobalSearchParams();
  return (
    <View style={tw`flex-1 bg-secondary-50 px-4 dark:bg-primary-950`}>
      <SubjectAbsencesView subjectID={+(subjectID as string)} />
    </View>
  );
}
