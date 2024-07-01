import { router, useLocalSearchParams } from 'expo-router';
import { useOrganizations } from '@/data/organizations';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { View } from 'react-native';
import FormInput from '@/components/form-input';
import LargeButton from '@/components/large-button';
import tw from '@/lib/tailwind';

export default function CreateAnnouncement() {
  const { subject, className, organization } = useLocalSearchParams();
  const { addAnnouncement } = useOrganizations();

  const schema = yup.object().shape({
    title: yup.string().required('Title is required'),
    body: yup.string().required('Body is required'),
    date: yup.date().required('Date is required')
  });
  const { control, handleSubmit } = useForm({
    mode: 'onChange',
    defaultValues: {
      title: '',
      body: '',
      date: new Date()
    },
    resolver: yupResolver(schema)
  });
  const onSubmit = async (values: any) => {
    addAnnouncement(
      organization as string,
      className as string,
      subject as string,
      values
    );
    router.back();
  };

  return (
    <View style={tw`flex-1 bg-secondary-50 px-4 dark:bg-primary-950`}>
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
      <LargeButton text='Create' onPress={handleSubmit(onSubmit)} />
    </View>
  );
}
