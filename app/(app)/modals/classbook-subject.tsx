import { router, Stack, useGlobalSearchParams } from 'expo-router';
import ModalHeader from '@/components/modal-header';
import { View } from 'react-native';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import tw from '@/lib/tailwind';
import { useState } from 'react';
import ParentSubjectGradesView from '@/components/parent-subject-grades-view';
import ParentSubjectAbsencesView from '@/components/parent-subject-absences-view';

export default function ClassbookSubject() {
  const { subjectID, subjectName, userType } = useGlobalSearchParams<{
    subjectID: string;
    subjectName: string;
    userType: string;
  }>();

  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <>
      <Stack.Screen
        options={{
          header: () => (
            <ModalHeader
              text={subjectName as string}
              onPress={() => {
                router.back();
              }}
            />
          )
        }}
      />
      <View style={tw`flex-1 gap-6 bg-secondary-100 px-4 dark:bg-primary-950`}>
        <SegmentedControl
          values={['Grades', 'Absences']}
          selectedIndex={selectedIndex}
          onChange={(event) => {
            setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
          }}
        />
        {selectedIndex === 0 ? (
          <ParentSubjectGradesView subjectID={+(subjectID as string)} />
        ) : (
          <ParentSubjectAbsencesView subjectID={+(subjectID as string)} />
        )}
      </View>
    </>
  );
}
