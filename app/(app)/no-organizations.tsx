import { Text, View } from 'react-native';
import LargeButton from '@/components/large-button';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormInput from '@/components/form-input';
import { useAccount } from '@/data/accounts';
import tw from '@/lib/tailwind';

export default function NoOrganizations() {
  const { accounts, addOrganization, loggedIn } = useAccount();
  const schema = yup.object({
    code: yup.string().required()
  });
  const { control, handleSubmit } = useForm({
    defaultValues: {
      code: ''
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  });
  const onSubmit = async (data: { email: string; password: string }) => {};
  return (
    <View
      style={tw`flex-1 justify-center gap-4 bg-secondary-blue-100 px-4 dark:bg-primary-blue-950`}
    >
      <Text
        style={tw`pb-4 text-center text-4xl font-bold text-primary-blue-800 dark:text-primary-blue-50`}
      >
        You are not a member of any organizations.
      </Text>
      <Text>{JSON.stringify(accounts)}</Text>
      <FormInput
        control={control}
        name='code'
        placeholder='Enter the class code...'
        secureTextEntry={false}
        inputAccessoryViewID=''
        errorText='Code is not valid'
        contentType='default'
        flex1={false}
      />
      <LargeButton
        text='Join a class'
        onPress={() => {
          addOrganization('Test@text.com', 'test');
        }}
      />
    </View>
  );
}
