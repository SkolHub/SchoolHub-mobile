import { FlatList, Modal, Pressable, Text, View } from 'react-native';
import { Absence, useAbsences } from '@/data/absences';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import ModalHeader from '@/components/modal-header';
import tw from '@/lib/tailwind';

export default function Index() {
  const { absences } = useAbsences();
  const [absencesBySubject, setAbsencesBySubject] =
    useState<Record<string, any>>();

  const [visible, setVisible] = useState(false);
  const [modalData, setModalData] = useState<any>({});

  useEffect(() => {
    const absencesBySubject = absences.reduce(
      (
        acc: Record<
          string,
          {
            absences: Absence[];
            countUnexcused: number;
          }
        >,
        absence
      ) => {
        if (!acc[absence.subject]) {
          acc[absence.subject] = { absences: [], countUnexcused: 0 };
        }
        acc[absence.subject].absences.push(absence);
        if (!absence.excused) {
          acc[absence.subject].countUnexcused += 1;
        }
        return acc;
      },
      {}
    );

    setAbsencesBySubject(absencesBySubject);
  }, [absences]);

  let absencesBySubjectArray = [];
  if (absencesBySubject) {
    absencesBySubjectArray = Object.keys(absencesBySubject).map((key) => ({
      subject: key,
      ...absencesBySubject[key]
    }));
  }

  return (
    <View style={tw`bg-secondary-100 dark:bg-primary-950 flex-1 px-4`}>
      <FlatList
        data={absencesBySubjectArray}
        renderItem={({ item, index }) => (
          <Pressable
            onPress={() => {
              setModalData(item);
              setVisible(true);
            }}
            style={tw.style(
              'bg-neutral-50 p-4 active:opacity-80 dark:bg-neutral-700',
              index === 0 ? 'rounded-t-3xl' : '',
              index === absencesBySubjectArray.length - 1
                ? 'rounded-b-3xl'
                : '',
              index !== absencesBySubjectArray.length - 1
                ? 'border-b border-black/10 dark:border-white/10'
                : ''
            )}
          >
            <Text
              style={tw`text-primary-800 dark:text-primary-50 text-lg font-bold leading-tight`}
            >
              {item.subject}
            </Text>
            <Text
              style={tw`text-primary-500 dark:text-primary-300 text-base font-bold leading-tight`}
            >
              {'Unexcused absences: ' + item.countUnexcused}
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
        <View style={tw`bg-secondary-100 dark:bg-primary-950 flex-1 px-4`}>
          <FlatList
            data={modalData.absences}
            renderItem={({ item, index }) => (
              <Pressable
                onPress={() => {
                  setModalData(item);
                  setVisible(true);
                }}
                style={tw.style(
                  'bg-neutral-50 p-4 active:opacity-80 dark:bg-neutral-700',
                  index === 0 ? 'rounded-t-3xl' : '',
                  index === modalData.absences.length - 1
                    ? 'rounded-b-3xl'
                    : '',
                  index !== modalData.absences.length - 1
                    ? 'border-b border-black/10 dark:border-white/10'
                    : ''
                )}
              >
                <Text
                  style={tw`text-primary-800 dark:text-primary-50 text-lg font-bold leading-tight`}
                >
                  {`${new Date(item.date)
                    .getDate()
                    .toString()
                    .padStart(2, '0')}.${(new Date(item.date).getMonth() + 1)
                    .toString()
                    .padStart(2, '0')}.${new Date(item.date).getFullYear()}`}
                </Text>
                <Text
                  style={tw`text-primary-500 dark:text-primary-300 text-base font-bold leading-tight`}
                >
                  {item.excused ? 'Excused' : 'Unexcused'}
                </Text>
                {item?.assignment ? (
                  <Text
                    style={tw`text-primary-500 dark:text-primary-300 text-base font-bold leading-tight`}
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
