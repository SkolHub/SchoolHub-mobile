import { FlatList, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useOrganizations } from '@/data/organizations';
import { useGrades } from '@/data/grades';
import { useAbsences } from '@/data/absences';
import { useEffect, useState } from 'react';
import AssignmentCard from '@/components/assignment-card';
import AnnouncementCard from '@/components/announcement-card';
import LargeButton from '@/components/large-button';
import tw from '@/lib/tailwind';

export default function Index() {
  const { subject, className } = useLocalSearchParams();
  const { activeOrganization } = useOrganizations();
  const { getSubject } = useOrganizations();

  const subjectData = getSubject(
    activeOrganization,
    className as string,
    subject as string
  );

  const { grades } = useGrades();
  const { absences } = useAbsences();

  const [mean, setMean] = useState(10);
  const [unexcusedAbsences, setUnexcusedAbsences] = useState(0);
  const [assignmentsNum, setAssignmentsNum] = useState(0);

  useEffect(() => {
    let sum = 0;
    let count = 0;
    let subjectGrades = grades.filter(
      (grade) => grade.subject === subjectData.name
    );
    subjectGrades.forEach((grade) => {
      sum += grade.grade;
      count++;
    });
    setMean(sum / count);

    let unexcused = 0;
    let subjectAbsences = absences.filter(
      (absence) => absence.subject === subjectData.name
    );
    subjectAbsences.forEach((absence) => {
      if (!absence.excused) {
        unexcused++;
      }
    });
    setUnexcusedAbsences(unexcused);

    let assignments = 0;
    subjectData.assignments.forEach((assignment) => {
      assignments++;
    });
    setAssignmentsNum(assignments);
  }, [grades, absences]);

  const streamData = [...subjectData.assignments, ...subjectData.announcements];

  streamData.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const theme = subjectData.theme || 'blue';

  return (
    <View style={tw`bg-secondary-${theme}-50 dark:bg-primary-950 flex-1 px-4`}>
      <LargeButton
        text='Create announcement'
        onPress={() => {
          router.push({
            pathname: '/modals/create-announcement',
            params: {
              subject: subject,
              className: className,
              organization: activeOrganization
            }
          });
        }}
        style='mb-3'
        theme={theme}
      />
      <LargeButton
        text='Create assignment'
        onPress={() => {
          router.push({
            pathname: '/modals/create-assignment',
            params: {
              subject: subject,
              className: className,
              organization: activeOrganization
            }
          });
        }}
        style='mb-6'
        theme={theme}
      />
      <FlatList
        data={streamData}
        renderItem={({ item }: any) => {
          if (item?.due) {
            return (
              <AssignmentCard
                onPress={() => {
                  router.push({
                    pathname: '/teacher/assignment',
                    params: {
                      subject: subject,
                      className: className,
                      assignment: item.title
                    }
                  });
                }}
                title={item.title}
                dueDate={`${new Date(item.due)
                  .getDate()
                  .toString()
                  .padStart(2, '0')}.${(new Date(item.due).getMonth() + 1)
                  .toString()
                  .padStart(2, '0')}.${new Date(item.due).getFullYear()}`}
              />
            );
          }
          return (
            <AnnouncementCard
              title={item.title}
              body={item.body}
              date={`${new Date(item.date)
                .getDate()
                .toString()
                .padStart(2, '0')}.${(new Date(item.date).getMonth() + 1)
                .toString()
                .padStart(2, '0')}.${new Date(item.date).getFullYear()}`}
            />
          );
        }}
      />
    </View>
  );
}
