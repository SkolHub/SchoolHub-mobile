import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView } from 'react-native';
import ModalHeader from '@/components/modal-header';
import tw from '@/lib/tailwind';
import StudentGrades from '@/components/student-grades';
import StudentAbsences from '@/components/student-absences';

export default function StudentClassbook() {
  const { studentID, subjectID, studentName } = useLocalSearchParams();

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
        <StudentGrades
          studentID={studentID as string}
          studentName={studentName as string}
          subjectID={subjectID as string}
        />
        <StudentAbsences
          studentID={studentID as string}
          studentName={studentName as string}
          subjectID={subjectID as string}
        />
      </ScrollView>
    </>
  );
}
