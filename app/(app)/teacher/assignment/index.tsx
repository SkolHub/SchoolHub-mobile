import { router, useLocalSearchParams } from 'expo-router';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useOrganizations } from '@/data/organizations';
import LargeButton from '@/components/large-button';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as DocumentPicker from 'expo-document-picker';
import Caption from '@/components/caption';
import ModalHeader from '@/components/modal-header';
import React from 'react';
import FormInput from '@/components/form-input';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Toast from 'react-native-toast-message';
import { useGrades } from '@/data/grades';
import FileViewer from 'react-native-file-viewer';
import tw from '@/lib/tailwind';

export default function Index() {
  const { subject, className, assignment } = useLocalSearchParams();
  const {
    activeOrganization,
    organizations,
    getOrganization,
    addSubmission,
    setSubmitted
  } = useOrganizations();
  const { addGrade } = useGrades();

  const [visible, setVisible] = React.useState(false);

  const assignmentData = getOrganization(activeOrganization)
    .classes.find((cls) => cls.name === className)
    ?.subjects.find((sub) => sub.name === subject)
    ?.assignments.find((a) => a.title === assignment);

  const subjectData = getOrganization(activeOrganization)
    .classes.find((cls) => cls.name === className)
    ?.subjects.find((sub) => sub.name === subject);

  const theme = subjectData?.theme || 'blue';

  const schema = yup.object({
    grade: yup.number().required()
  });
  const { control, handleSubmit } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema)
  });
  const onSubmit = async (data: { grade: number }) => {
    addGrade({
      subject: subject as string,
      grade: data.grade,
      date: new Date(),
      assignment: assignment as string
    });
    setVisible(false);
  };

  return (
    <ScrollView
      contentContainerStyle={tw`px-4`}
      style={tw`bg-secondary-${theme}-50 dark:bg-primary-${theme}-950 flex-1`}
    >
      <View style={tw`mb-4 rounded-3xl bg-neutral-50 p-4 dark:bg-neutral-700`}>
        <Text
          style={tw`text-primary-${theme}-800 dark:text-primary-${theme}-50 text-lg font-medium leading-tight`}
        >
          {assignmentData?.body}
        </Text>
        <Text
          style={tw`text-primary-${theme}-700 dark:text-primary-${theme}-200 text-lg font-semibold leading-tight`}
        >
          {`Posted ${new Date(assignmentData!.date)
            .getDate()
            .toString()
            .padStart(2, '0')}.${(new Date(assignmentData!.date).getMonth() + 1)
            .toString()
            .padStart(2, '0')}.${new Date(assignmentData!.date).getFullYear()}`}
        </Text>
        <Text
          style={tw`text-primary-${theme}-700 dark:text-primary-${theme}-200 text-lg font-semibold leading-tight`}
        >
          {`Due ${new Date(assignmentData!.due)
            .getDate()
            .toString()
            .padStart(2, '0')}.${(new Date(assignmentData!.due).getMonth() + 1)
            .toString()
            .padStart(2, '0')}.${new Date(assignmentData!.due).getFullYear()}`}
        </Text>
      </View>
      <Caption text='Submissions' />
      <View style={tw`gap-2 rounded-3xl bg-neutral-50 p-4 dark:bg-neutral-700`}>
        <View
          style={tw`gap-2 rounded-3xl bg-neutral-400 px-4 py-4 dark:bg-neutral-600`}
        >
          <Text
            style={tw`text-primary-${theme}-800 dark:text-primary-${theme}-200 text-2xl font-semibold leading-tight`}
          >
            Test Text
          </Text>
          <Text
            style={tw`text-primary-${theme}-800 dark:text-primary-${theme}-200 text-lg font-semibold leading-tight`}
          >
            {`${new Date(assignmentData!.date)
              .getDate()
              .toString()
              .padStart(2, '0')}.${(
              new Date(assignmentData!.date).getMonth() + 1
            )
              .toString()
              .padStart(
                2,
                '0'
              )}.${new Date(assignmentData!.date).getFullYear()}`}
          </Text>
          {assignmentData!.submissions.map((submission, index) => (
            <Pressable
              onPress={async () => {
                await FileViewer.open(submission.uri);
              }}
              key={index}
              style={tw`flex-row items-center gap-2`}
            >
              <Ionicons name='document-attach' size={30} color='#bbbbbb' />
              <Text
                style={tw`text-primary-${theme}-800 dark:text-primary-${theme}-200 text-lg font-semibold leading-tight`}
              >
                {submission.name}
              </Text>
            </Pressable>
          ))}
          <LargeButton
            text='Add grade'
            onPress={() => {
              setVisible(true);
            }}
          />
        </View>
      </View>
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
          <FormInput
            control={control}
            name='grade'
            placeholder='Grade'
            secureTextEntry={false}
            inputAccessoryViewID=''
            errorText=''
            contentType='number'
            flex1={false}
          />
          <LargeButton
            text='Add grade'
            style='mt-4'
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </Modal>
    </ScrollView>
  );
}
