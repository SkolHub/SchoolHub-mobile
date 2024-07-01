import { FlatList, Modal, Pressable, Text, View } from 'react-native';
import { useGlobalSearchParams } from 'expo-router';
import { useOrganizations } from '@/data/organizations';
import { useGrades } from '@/data/grades';
import { cn } from '@/lib/utils';
import Caption from '@/components/caption';
import { useState } from 'react';
import ModalHeader from '@/components/modal-header';
import LargeButton from '@/components/large-button';
import tw from '@/lib/tailwind';

export default function Grades() {
  const { subject, className } = useGlobalSearchParams();
  const { activeOrganization } = useOrganizations();
  const { getSubject } = useOrganizations();

  const [visible, setVisible] = useState(false);

  const subjectData = getSubject(
    activeOrganization,
    className as string,
    subject as string
  );

  const { grades } = useGrades();

  const subjectGrades = grades.filter(
    (grade) => grade.subject === subjectData.name
  );

  const theme = subjectData.theme || 'blue';

  return (
    <View
      style={tw`bg-secondary-${theme}-50 dark:bg-primary-${theme}-950 flex-1 px-4`}
    >
      <Caption text='Grades' />
      <Pressable
        onPress={() => setVisible(true)}
        style={tw.style(
          'rounded-3xl bg-neutral-50 p-4 active:opacity-80 dark:bg-neutral-700'
        )}
      >
        <Text
          style={tw`text-primary-${theme}-800 dark:text-primary-${theme}-50 text-lg font-bold leading-tight`}
        >
          Test Text
        </Text>
      </Pressable>
      <Modal
        presentationStyle='formSheet'
        animationType='slide'
        visible={visible}
      >
        <ModalHeader
          text={'Test Text'}
          onPress={() => {
            setVisible(false);
          }}
        />
        <View
          style={tw`bg-secondary-${theme}-100 dark:bg-primary-${theme}-950 flex-1 px-4`}
        >
          <LargeButton text='Create absence' onPress={() => {}} style='mb-4' />
          <FlatList
            data={subjectGrades}
            renderItem={({ item, index }) => (
              <Pressable
                style={tw.style(
                  'bg-neutral-50 p-4 active:opacity-80 dark:bg-neutral-700',
                  index === 0 ? 'rounded-t-3xl' : '',
                  index === subjectGrades.length - 1 ? 'rounded-b-3xl' : '',
                  index !== subjectGrades.length - 1
                    ? 'border-b border-black/10 dark:border-white/10'
                    : ''
                )}
              >
                <Text
                  style={tw`text-primary-${theme}-800 dark:text-primary-${theme}-50 text-xl font-bold leading-tight`}
                >
                  {item.grade}
                </Text>
                <Text
                  style={tw`text-primary-${theme}-500 dark:text-primary-${theme}-300 text-lg font-bold leading-tight`}
                >
                  {`${new Date(item.date).getDate().toString().padStart(2, '0')}.${(
                    new Date(item.date).getMonth() + 1
                  )
                    .toString()
                    .padStart(2, '0')}.${new Date(item.date).getFullYear()}`}
                </Text>
                {item?.assignment ? (
                  <Text
                    style={tw`text-primary-${theme}-500 dark:text-primary-${theme}-300 text-lg font-bold leading-tight`}
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
