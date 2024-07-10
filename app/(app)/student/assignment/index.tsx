import { useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { useOrganizations } from '@/data/organizations';
import LargeButton from '@/components/large-button';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as DocumentPicker from 'expo-document-picker';
import tw from '@/lib/tailwind';

export default function Index() {
  const { postID } = useLocalSearchParams();

  // const { subject, className, assignment } = useLocalSearchParams();
  // const {
  //   activeOrganization,
  //   organizations,
  //   getOrganization,
  //   addSubmission,
  //   setSubmitted
  // } = useOrganizations();
  //
  // const assignmentData = getOrganization(activeOrganization)
  //   .classes.find((cls) => cls.name === className)
  //   ?.subjects.find((sub) => sub.name === subject)
  //   ?.assignments.find((a) => a.title === assignment);
  //
  // const subjectData = getOrganization(activeOrganization)
  //   .classes.find((cls) => cls.name === className)
  //   ?.subjects.find((sub) => sub.name === subject);
  //
  // const theme = subjectData?.theme || 'blue';

  return <></>;
  //   <ScrollView
  //     contentContainerStyle={tw`px-4`}
  //     style={tw`flex-1 bg-secondary-${theme}-50 dark:bg-primary-${theme}-950`}
  //   >
  //     <View style={tw`mb-4 rounded-3xl bg-neutral-50 p-4 dark:bg-neutral-700`}>
  //       <Text
  //         style={tw`text-lg font-medium leading-tight text-primary-${theme}-800 dark:text-primary-${theme}-50`}
  //       >
  //         {assignmentData?.body}
  //       </Text>
  //       <Text
  //         style={tw`text-lg font-semibold leading-tight text-primary-${theme}-700 dark:text-primary-${theme}-200`}
  //       >
  //         {`Posted ${new Date(assignmentData!.date)
  //           .getDate()
  //           .toString()
  //           .padStart(2, '0')}.${(new Date(assignmentData!.date).getMonth() + 1)
  //           .toString()
  //           .padStart(2, '0')}.${new Date(assignmentData!.date).getFullYear()}`}
  //       </Text>
  //       <Text
  //         style={tw`text-lg font-semibold leading-tight text-primary-${theme}-700 dark:text-primary-${theme}-200`}
  //       >
  //         {`Due ${new Date(assignmentData!.due)
  //           .getDate()
  //           .toString()
  //           .padStart(2, '0')}.${(new Date(assignmentData!.due).getMonth() + 1)
  //           .toString()
  //           .padStart(2, '0')}.${new Date(assignmentData!.due).getFullYear()}`}
  //       </Text>
  //     </View>
  //     <View
  //       style={tw`mt-4 gap-2 rounded-3xl bg-neutral-50 p-4 dark:bg-neutral-700`}
  //     >
  //       {assignmentData!.submissions.map((submission, index) => (
  //         <View
  //           key={index}
  //           style={tw`flex-row items-center gap-2 bg-neutral-50 dark:bg-neutral-700`}
  //         >
  //           <Ionicons name='document-attach' size={30} color='#bbbbbb' />
  //           <Text
  //             style={tw`text-lg font-semibold leading-tight text-primary-${theme}-800 dark:text-primary-${theme}-200`}
  //           >
  //             {submission.name}
  //           </Text>
  //         </View>
  //       ))}
  //       {!assignmentData!.submitted ? (
  //         <>
  //           <LargeButton
  //             contentContainerStyle='bg-neutral-400 dark:bg-neutral-600'
  //             text='Add attachment'
  //             onPress={async () => {
  //               let res = await DocumentPicker.getDocumentAsync({
  //                 multiple: false
  //               });
  //
  //               addSubmission(
  //                 activeOrganization,
  //                 className as string,
  //                 subject as string,
  //                 assignment as string,
  //                 // @ts-ignore
  //                 { name: res.assets[0].name, uri: res.assets[0].uri }
  //               );
  //               console.log(JSON.stringify(res));
  //             }}
  //             iconName='add'
  //           />
  //           <LargeButton
  //             text='Submit'
  //             onPress={() => {
  //               setSubmitted(
  //                 activeOrganization,
  //                 className as string,
  //                 subject as string,
  //                 assignment as string
  //               );
  //             }}
  //           />
  //         </>
  //       ) : (
  //         <LargeButton
  //           text='Submitted'
  //           iconName='checkmark-circle'
  //           contentContainerStyle='bg-neutral-400 dark:bg-neutral-600'
  //           textStyle='text-green-600'
  //           onPress={() => {
  //             setSubmitted(
  //               activeOrganization,
  //               className as string,
  //               subject as string,
  //               assignment as string
  //             );
  //           }}
  //         />
  //       )}
  //     </View>
  //   </ScrollView>
  // );
}
