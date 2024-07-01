import { FlatList, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useOrganizations } from '@/data/organizations';
import { useGrades } from '@/data/grades';
import { useAbsences } from '@/data/absences';
import { useEffect, useState } from 'react';
import AssignmentCard from '@/components/assignment-card';
import AnnouncementCard from '@/components/announcement-card';
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

  const theme = subjectData.theme;

  return (
    <View
      style={tw`flex-1 bg-secondary-${theme}-50 px-4 dark:bg-primary-${theme}-950`}
    >
      <View style={tw`mb-6 rounded-3xl bg-neutral-50 p-4 dark:bg-neutral-700`}>
        <View style={tw`flex-row justify-between`}>
          <View
            style={tw`flex-1 items-stretch border-r border-black/15 pr-4 dark:border-white/20`}
          >
            <Text
              style={tw`text-center text-xl font-bold text-primary-${theme}-800 dark:text-primary-${theme}-50`}
            >
              {assignmentsNum}
            </Text>
            <Text
              style={tw`flex-1 text-center text-sm font-semibold text-primary-${theme}-700 dark:text-primary-${theme}-200`}
            >
              assignments
            </Text>
          </View>
          <View
            style={tw`flex-1 items-stretch border-r border-black/15 px-4 dark:border-white/20`}
          >
            <Text
              style={tw`text-center text-xl font-bold text-primary-${theme}-800 dark:text-primary-${theme}-50`}
            >
              {mean > 0 ? mean : 'No grades'}
            </Text>
            <Text
              style={tw`text-center text-sm font-semibold text-primary-${theme}-700 dark:text-primary-${theme}-200`}
            >
              overall average
            </Text>
          </View>
          <View style={tw`flex-1 items-stretch pl-4`}>
            <Text
              style={tw`text-center text-xl font-bold text-primary-${theme}-800 dark:text-primary-${theme}-50`}
            >
              {unexcusedAbsences}
            </Text>
            <Text
              style={tw`text-center text-sm font-semibold text-primary-${theme}-700 dark:text-primary-${theme}-200`}
            >
              unexcused absences
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        data={streamData}
        renderItem={({ item }: any) => {
          if (item?.due) {
            return (
              <AssignmentCard
                onPress={() => {
                  router.push({
                    pathname: '/student/assignment',
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
                theme={theme}
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
              theme={theme}
            />
          );
        }}
      />
    </View>
  );
}
