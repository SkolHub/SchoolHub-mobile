import { Button, ScrollView, View } from 'react-native';
import ListItem from '@/components/list-item';
import List from '@/components/list';
import tw from '@/lib/tailwind';
import Stepper from '@/components/stepper';
import { useState } from 'react';
import LargeButton from '@/components/large-button';
import Caption from '@/components/caption';

function getRandomStrings(array: string[], count: number): string[] {
  const result = [];
  const tempArray = [...array]; // Create a copy of the array to avoid mutating the original
  for (let i = 0; i < count; i++) {
    if (tempArray.length === 0) {
      break; // Break if there are no more elements to choose from
    }
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    result.push(tempArray[randomIndex]);
    tempArray.splice(randomIndex, 1); // Remove the chosen element from the array
  }
  return result;
}

export default function Assessment() {
  const [students, setStudents] = useState<number>(1);

  const [studentGrades, setStudentGrades] =
    useState<{ student: string; grade: number | null }[]>();

  const dummies = [
    'Student 1',
    'Student 2',
    'Student 3',
    'Student 4',
    'Student 5',
    'Student 6',
    'Student 7',
    'Student 8',
    'Student 9',
    'Student 10'
  ];

  return (
    <ScrollView style={tw`bg-secondary-100 dark:bg-primary-950 flex-1 px-4`}>
      <List>
        <ListItem
          text='Number of students'
          rightComponent={
            <Stepper
              value={students}
              onPressMinus={() => {
                if (students > 1) {
                  setStudents(students - 1);
                }
              }}
              onPressPlus={() => {
                setStudents(students + 1);
              }}
            />
          }
        />
      </List>
      <LargeButton
        text={'Get students'}
        onPress={() => {
          const studentNames = getRandomStrings(dummies, students);
          setStudentGrades(
            studentNames.map((student) => ({ student, grade: null }))
          );
        }}
        style={'mt-4'}
      />
      <Caption text={'Student grades'} style={'mt-4'} />
      <List>
        {studentGrades?.map(({ student, grade }, index) => (
          <ListItem
            key={index}
            text={student}
            rightComponent={
              <Stepper
                value={grade ?? 0}
                onPressMinus={() => {
                  setStudentGrades((prev) => {
                    if (prev) {
                      prev[index].grade = Math.max(0, grade ? grade - 1 : 0);
                      return [...prev];
                    }
                    return prev;
                  });
                }}
                onPressPlus={() => {
                  setStudentGrades((prev) => {
                    if (prev) {
                      prev[index].grade = Math.min(10, grade ? grade + 1 : 0);
                      return [...prev];
                    }
                    return prev;
                  });
                }}
              />
            }
          />
        )) ?? []}
      </List>
      <LargeButton text={'Add grades'} onPress={() => {}} style={'mt-4'} />
    </ScrollView>
  );
}
