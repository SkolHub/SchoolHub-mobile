import { Text, View } from 'react-native';
import LargeButton from '@/components/large-button';
import { useAccount } from '@/data/accounts';
import { useOrganizations } from '@/data/organizations';
import { useGrades } from '@/data/grades';
import { useAbsences } from '@/data/absences';
import { router } from 'expo-router';
import tw from '@/lib/tailwind';

export default function Developer() {
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
    addSubject,
    addAssignment,
    addAnnouncement
  } = useOrganizations();
  const { addGrade } = useGrades();
  const { addAbsence } = useAbsences();

  const org = getOrganization('CNI Gr Moisil');

  return (
    <View>
      <Text style={tw`text-red-500`}>{JSON.stringify(org)}</Text>
      <LargeButton
        text='mod ascultare'
        onPress={() => {
          router.push({
            pathname: '/modals/assessment'
          });
        }}
      />
      <LargeButton
        text='add assignment'
        onPress={() => {
          addAssignment('CNI Gr Moisil', 'Clasa XD', 'Informatica', {
            title: 'Test Announcement',
            body: 'Test Content',
            date: new Date(),
            due: new Date(),
            submissions: [],
            submitted: false,
            submittedAt: null
          });
        }}
      />
      <LargeButton
        text='add announcement'
        onPress={() => {
          addAnnouncement('CNI Gr Moisil', 'Clasa XD', 'Informatica', {
            title: 'Test Announcement',
            body: 'Test Content',
            date: new Date()
          });
        }}
      />
      <LargeButton
        text='add absence'
        onPress={() => {
          addAbsence({
            date: new Date(),
            subject: 'Matematica',
            excused: false
          });
        }}
      />
      <LargeButton
        text='add grade'
        onPress={() => {
          addGrade({
            grade: 10,
            subject: 'Matematica',
            date: new Date(),
            assignment: 'Test Assignment'
          });
        }}
      />
      <LargeButton
        text='create subject'
        onPress={() => {
          addSubject('CNI Gr Moisil', 'Clasa XD', {
            name: 'Matematica',
            teacher: 'Test Teacher',
            announcements: [],
            assignments: [],
            icon: 'compass',
            theme: 'green'
          });
        }}
      />
      <LargeButton
        text='delete acc org'
        onPress={() => {
          deleteOrg(loggedIn?.email ?? '', 'test');
        }}
      />
      <LargeButton
        text='delete acc class'
        onPress={() => {
          deleteClass(loggedIn?.email ?? '', 'Clasa XD');
        }}
      />
      <LargeButton
        text='delete org'
        onPress={() => {
          deleteOrganization('test');
        }}
      />
      <LargeButton
        text='set active org'
        onPress={() => {
          setActiveOrganization('CNI Gr Moisil');
        }}
      />
      <LargeButton
        text='add class to account'
        onPress={() => {
          addClass(loggedIn?.email || '', 'Others');
        }}
      />
      <LargeButton
        text='add class'
        onPress={() => {
          createClass('CNI Gr Moisil', {
            name: 'Clasa XD',
            teacher: 'Test Text',
            subjects: []
          });
        }}
      />
      <LargeButton
        text='add org to acc'
        onPress={() => {
          addOrg(loggedIn?.email ?? '', 'CNI Gr Moisil');
        }}
      />
      <LargeButton
        text='add org'
        onPress={() => {
          addOrganization('CNI Gr Moisil');
        }}
      />
      <LargeButton
        text='logout'
        onPress={() => {
          setLoggedIn(null);
        }}
      />
    </View>
  );
}
