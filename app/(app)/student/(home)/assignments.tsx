import { Text, View } from 'react-native';
import { useOrganizations } from '@/data/organizations';
import AssignmentCard from '@/components/assignment-card';
import tw from '@/lib/tailwind';

export default function Assignments() {
  const { activeOrganization, organizations, getOrganization } =
    useOrganizations();

  const assignments = getOrganization(activeOrganization).classes.flatMap(
    (c) => {
      return c.subjects.flatMap((s) => {
        return s.assignments;
      });
    }
  );

  return (
    <View style={tw`bg-secondary-100 dark:bg-primary-950 flex-1 px-4`}>
      {assignments.map((item, index) => (
        <AssignmentCard
          key={index}
          onPress={() => {}}
          title={item.title}
          dueDate={`${new Date(item.date)
            .getDate()
            .toString()
            .padStart(2, '0')}.${(new Date(item.date).getMonth() + 1)
            .toString()
            .padStart(2, '0')}.${new Date(item.date).getFullYear()}`}
        />
      ))}
    </View>
  );
}
