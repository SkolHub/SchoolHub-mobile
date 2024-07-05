import { ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import Caption from '@/components/caption';
import SubjectCard from '@/components/subject-card';
import tw from '@/lib/tailwind';
import { useGetStudentSubjects } from '@/api/subject';

export default function Index() {
  const subjects = useGetStudentSubjects();

  console.log(subjects.error);

  return (
    <>
      <ScrollView
        style={tw`bg-secondary-100 flex-1 dark:bg-primary-blue-950`}
        contentContainerStyle={tw`px-4`}
      >
        {subjects.data?.map((class_, index) => (
          <View key={index}>
            <Caption text={class_.name} key={class_.name} />
            <View style={tw`gap-3`}>
              {class_.subjects.map((subject, index) => (
                <SubjectCard
                  name={subject.name}
                  icon={subject.icon}
                  // teacher={subject.teacher}
                  onPress={() => {
                    router.push({
                      pathname: '/student/subject',
                      params: {
                        subject: subject.name,
                        className: class_.name
                      }
                    });
                  }}
                  key={index}
                />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </>
  );
}
