import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { Text, View } from 'react-native';
import FormInput from '@/components/form-input';
import DatePicker from 'react-native-date-picker';
import { useOrganizations } from '@/data/organizations';
import LargeButton from '@/components/large-button';
import { router, useLocalSearchParams } from 'expo-router';
import tw from '@/lib/tailwind';

export default function CreateAssignment() {
  const { subject, className, organization } = useLocalSearchParams();
  const { addAssignment } = useOrganizations();

  const [dueDate, setDueDate] = useState(new Date());

  const schema = yup.object({
    title: yup.string().required(),
    body: yup.string().required()
  });
  const { control, handleSubmit } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema)
  });
  const onSubmit = async (data: { title: string; body: string }) => {
    addAssignment(
      organization as string,
      className as string,
      subject as string,
      {
        title: data.title,
        body: data.body,
        date: new Date(),
        due: dueDate,
        submissions: [],
        submitted: false,
        submittedAt: null
      }
    );
    router.back();
  };

  return (
    <View style={tw`bg-secondary-50 dark:bg-primary-950 flex-1 gap-4 px-4`}>
      <FormInput
        control={control}
        name='title'
        placeholder='Title'
        secureTextEntry={false}
        inputAccessoryViewID=''
        errorText=''
        contentType='default'
        flex1={false}
      />
      <FormInput
        control={control}
        name='body'
        placeholder='Body'
        multiline={true}
        numberOfLines={10}
        secureTextEntry={false}
        inputAccessoryViewID=''
        errorText=''
        contentType='default'
        flex1={false}
      />
      <Text
        style={tw`text-lg font-medium leading-tight text-primary-800 dark:text-primary-50`}
      >
        Due date
      </Text>
      <DatePicker mode='date' date={dueDate} onDateChange={setDueDate} />
      <LargeButton text='Create' onPress={handleSubmit(onSubmit)} />
    </View>
  );
}
