import { ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { useAccount } from '@/data/accounts';
import { useOrganizations } from '@/data/organizations';
import Caption from '@/components/caption';
import SubjectCard from '@/components/subject-card';
import { useEffect } from 'react';
import tw from '@/lib/tailwind';

export default function Index() {
  const {
    setLoggedIn,
    loggedIn,
    addClass,
    deleteOrganization: deleteOrg,
    deleteClass,
    addOrganization: addOrg
  } = useAccount();
  const {
    organizations,
    addOrganization,
    addClass: createClass,
    setActiveOrganization,
    deleteOrganization,
    getOrganization,
    addSubject
  } = useOrganizations();

  if (loggedIn?.organizations.length === 0) {
    // return <Redirect href='/no-organizations' />;
  }

  const org = getOrganization('CNI Gr Moisil');

  return (
    <>
      <ScrollView
        style={tw`dark:bg-primary-950 flex-1 bg-secondary-blue-100`}
        contentContainerStyle={tw`px-4`}
      >
        {org.classes.map((class_, index) => (
          <View key={index}>
            <Caption text={class_.name} key={class_.name} />
            <View style={tw`gap-3`}>
              {class_.subjects.map((subject, index) => (
                <SubjectCard
                  name={subject.name}
                  icon={subject.icon}
                  teacher={subject.teacher}
                  onPress={() => {
                    router.push({
                      pathname: '/teacher/subject',
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
