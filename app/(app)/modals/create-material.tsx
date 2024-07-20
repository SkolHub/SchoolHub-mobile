import { router, useLocalSearchParams } from 'expo-router';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { View } from 'react-native';
import FormInput from '@/components/form-input';
import LargeButton from '@/components/large-button';
import tw from '@/lib/tailwind';
import { useCreateTeacherPost } from '@/api/post';

export default function CreateAnnouncement() {
  const { subjectID } = useLocalSearchParams();

  const createTeacherPost = useCreateTeacherPost();

  const schema = yup.object().shape({
    title: yup.string().required('Title is required'),
    body: yup.string().required('Body is required')
  });
  const { control, handleSubmit } = useForm({
    mode: 'onChange',
    defaultValues: {
      title: '',
      body: ''
    },
    resolver: yupResolver(schema)
  });
  const onSubmit = async (values: { title: string; body: string }) => {
    await createTeacherPost.mutateAsync({
      title: values.title,
      body: values.body,
      subjectID: subjectID as string,
      type: 'material'
    });
    router.back();
  };

  return (
    <View style={tw`flex-1 gap-4 bg-secondary-100 px-4 dark:bg-primary-950`}>
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