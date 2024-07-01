import { FlatList, Pressable, Text, View } from 'react-native';
import { useGlobalSearchParams } from 'expo-router';
import { useOrganizations } from '@/data/organizations';
import { useAbsences } from '@/data/absences';
import Caption from '@/components/caption';
import tw from '@/lib/tailwind';

export default function Absences() {
  const { subject, className } = useGlobalSearchParams();
  const { activeOrganization } = useOrganizations();
  const { getSubject } = useOrganizations();

  const subjectData = getSubject(
    activeOrganization,
    className as string,
    subject as string
  );

  const { absences } = useAbsences();

  const subjectAbsences = absences.filter(
    (absence) => absence.subject === subjectData.name
  );

  const theme = subjectData.theme;

  return (
    <View
      style={tw`flex-1 bg-secondary-${theme}-50 px-4 dark:bg-primary-${theme}-950`}
    >
      <Caption text='Absences' theme={theme} />
      <FlatList
        data={subjectAbsences}
        renderItem={({ item, index }) => (
          <Pressable
            style={tw.style(
              'bg-neutral-50 p-4 active:opacity-80 dark:bg-neutral-700',
              index === 0 ? 'rounded-t-3xl' : '',
              index === subjectAbsences.length - 1 ? 'rounded-b-3xl' : '',
              index !== subjectAbsences.length - 1
                ? 'border-b border-black/10 dark:border-white/10'
                : ''
            )}
          >
            <Text
              style={tw`text-lg font-bold leading-tight text-primary-${theme}-800 dark:text-primary-${theme}-50`}
            >
              {`${new Date(item.date).getDate().toString().padStart(2, '0')}.${(
                new Date(item.date).getMonth() + 1
              )
                .toString()
                .padStart(2, '0')}.${new Date(item.date).getFullYear()}`}
            </Text>
            <Text
              style={tw`text-base font-bold leading-tight text-primary-${theme}-500 dark:text-primary-${theme}-300`}
            >
              {item.excused ? 'Excused' : 'Unexcused'}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}
