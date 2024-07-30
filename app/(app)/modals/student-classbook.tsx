import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView } from 'react-native';
import ModalHeader from '@/components/modal-header';
import tw from '@/lib/tailwind';
import StudentGrades from '@/components/student-grades';
import StudentAbsences from '@/components/student-absences';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { useState } from 'react';
import StudentObservations from '@/components/student-observations';
import { t } from '@lingui/macro';

export default function StudentClassbook() {
  const { studentID, subjectID, studentName } = useLocalSearchParams();
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <>
      <Stack.Screen
        options={{
          header: () => (
            <ModalHeader
              text={studentName as string}
              onPress={() => {
                router.back();
              }}
            />
          )
        }}
      />

      <ScrollView
        style={tw`bg-secondary-100 px-4 dark:bg-primary-950`}
        contentContainerStyle={tw`pb-20`}
      >
        <SegmentedControl
          style={tw`mb-6`}
          values={[t`Grades`, t`Absences`, t`Observations`]}
          selectedIndex={selectedIndex}
          onChange={(event) => {
            setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
          }}
        />
        {selectedIndex === 0 ? (
          <StudentGrades
            studentID={studentID as string}
            studentName={studentName as string}
            subjectID={subjectID as string}
          />
        ) : selectedIndex === 1 ? (
          <StudentAbsences
            studentID={studentID as string}
            studentName={studentName as string}
            subjectID={subjectID as string}
          />
        ) : (
          <StudentObservations
            subjectID={subjectID as string}
            studentID={studentID as string}
            studentName={studentName as string}
          />
        )}
      </ScrollView>
    </>
  );
}
