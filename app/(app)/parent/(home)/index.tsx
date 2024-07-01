import { FlatList, Modal, Pressable, Text, View } from 'react-native';
import { useGrades } from '@/data/grades';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import ModalHeader from '@/components/modal-header';
import tw from '@/lib/tailwind';

export default function Index() {
  const { grades } = useGrades();
  const [gradesBySubject, setGradesBySubject] = useState<Record<string, any>>();

  const [visible, setVisible] = useState(false);
  const [modalData, setModalData] = useState<any>({});

  useEffect(() => {
    const gradesBySubject = grades.reduce(
      (
        acc: Record<
          string,
          { grades: any[]; sum: number; count: number; mean?: number }
        >,
        grade
      ) => {
        if (!acc[grade.subject]) {
          acc[grade.subject] = { grades: [], sum: 0, count: 0 };
        }
        acc[grade.subject].grades.push(grade);
        acc[grade.subject].sum += grade.grade; // assuming 'grade' property holds the grade value
        acc[grade.subject].count += 1;
        return acc;
      },
      {}
    );

    // Calculate the arithmetic mean for each subject
    for (const subject in gradesBySubject) {
      gradesBySubject[subject].mean =
        gradesBySubject[subject].sum / gradesBySubject[subject].count;
    }

    setGradesBySubject(gradesBySubject);
  }, []);

  let gradesBySubjectArray = [];
  if (gradesBySubject) {
    gradesBySubjectArray = Object.keys(gradesBySubject).map((key) => ({
      subject: key,
      ...gradesBySubject[key]
    }));
  }

  return (
    <View
      style={tw`flex-1 bg-secondary-blue-100 px-4 dark:bg-primary-blue-950`}
    >
      <FlatList
        data={gradesBySubjectArray}
        renderItem={({ item, index }) => (
          <Pressable
            onPress={() => {
              setModalData(item);
              setVisible(true);
            }}
            style={tw.style(
              'bg-neutral-50 p-4 active:opacity-80 dark:bg-neutral-700',
              index === 0 ? 'rounded-t-3xl' : '',
              index === gradesBySubjectArray.length - 1 ? 'rounded-b-3xl' : '',
              index !== gradesBySubjectArray.length - 1
                ? 'border-b border-black/10 dark:border-white/10'
                : ''
            )}
          >
            <Text
              style={tw`text-lg font-bold leading-tight text-primary-blue-800 dark:text-primary-blue-50`}
            >
              {item.subject}
            </Text>
            <Text
              style={tw`text-base font-bold leading-tight text-primary-blue-500 dark:text-primary-blue-300`}
            >
              {'Average: ' + item.mean}
            </Text>
          </Pressable>
        )}
      />
      <Modal
        presentationStyle='formSheet'
        animationType='slide'
        visible={visible}
      >
        <ModalHeader
          text={modalData.subject}
          onPress={() => {
            setVisible(false);
          }}
        />
        <View
          style={tw`flex-1 bg-secondary-blue-100 px-4 dark:bg-primary-blue-950`}
        >
          <FlatList
            data={modalData.grades}
            renderItem={({ item, index }) => (
              <Pressable
                onPress={() => {
                  setModalData(item);
                  setVisible(true);
                }}
                style={tw.style(
                  'bg-neutral-50 p-4 active:opacity-80 dark:bg-neutral-700',
                  index === 0 ? 'rounded-t-3xl' : '',
                  index === modalData.grades.length - 1 ? 'rounded-b-3xl' : '',
                  index !== modalData.grades.length - 1
                    ? 'border-b border-black/10 dark:border-white/10'
                    : ''
                )}
              >
                <Text
                  style={tw`text-lg font-bold leading-tight text-primary-blue-800 dark:text-primary-blue-50`}
                >
                  {item.grade}
                </Text>
                <Text
                  style={tw`text-base font-bold leading-tight text-primary-blue-500 dark:text-primary-blue-300`}
                >
                  {`${new Date(item.date)
                    .getDate()
                    .toString()
                    .padStart(2, '0')}.${(new Date(item.date).getMonth() + 1)
                    .toString()
                    .padStart(2, '0')}.${new Date(item.date).getFullYear()}`}
                </Text>
                {item?.assignment ? (
                  <Text
                    style={tw`text-base font-bold leading-tight text-primary-blue-500 dark:text-primary-blue-300`}
                  >
                    {item.assignment}
                  </Text>
                ) : null}
              </Pressable>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}
