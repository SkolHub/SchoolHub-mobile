import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import FormInput from '@/components/form-input';
import DatePicker from 'react-native-date-picker';
import LargeButton from '@/components/large-button';
import { router, useLocalSearchParams } from 'expo-router';
import tw from '@/lib/tailwind';
import List from '@/components/list';
import ListItem from '@/components/list-item';
import Modal from 'react-native-modal';
import Caption from '@/components/caption';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useCreateTeacherPost } from '@/api/post';
import { t } from '@lingui/macro';

export default function CreateAssignment() {
  const createPost = useCreateTeacherPost();

  const { subjectID } = useLocalSearchParams();

  const [dueDate, setDueDate] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);

  const schema = yup.object({
    title: yup.string().required(),
    body: yup.string().required()
  });
  const { control, handleSubmit } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema)
  });
  const onSubmit = async (data: { title: string; body: string }) => {
    const res = await createPost.mutateAsync({
      title: data.title,
      body: data.body,
      subjectID: subjectID as string,
      type: 'test',
      dueDate: dueDate.toISOString()
    });

    router.back();
  };

  return (
    <View style={tw`flex-1 gap-4 bg-secondary-100 px-4 dark:bg-primary-950`}>
      <FormInput
        control={control}
        name='title'
        placeholder={t`Title`}
        secureTextEntry={false}
        inputAccessoryViewID=''
        errorText={t`Title must be completed`}
        contentType='default'
        flex1={false}
      />
      <FormInput
        control={control}
        name='body'
        placeholder={t`Body`}
        multiline={true}
        numberOfLines={10}
        secureTextEntry={false}
        inputAccessoryViewID=''
        errorText={t`Body must be completed`}
        contentType='default'
        flex1={false}
      />
      <List>
        <ListItem
          text={t`Planned on`}
          rightComponent={
            <Pressable
              style={tw`rounded-xl bg-neutral-200 px-4 py-3 dark:bg-neutral-600`}
              onPress={() => setModalVisible(true)}
            >
              <Text style={tw`text-black dark:text-white`}>
                {dueDate.toLocaleString('ro-RO', {
                  dateStyle: 'short'
                })}
              </Text>
            </Pressable>
          }
        />
      </List>
      <LargeButton text={t`Create`} onPress={handleSubmit(onSubmit)} />
      <Modal
        animationIn={'slideInUp'}
        isVisible={modalVisible}
        onBackdropPress={() => {
          setModalVisible(false);
        }}
        onSwipeComplete={() => {
          setModalVisible(false);
        }}
        swipeDirection={['down']}
        style={tw`mx-4 mb-8 justify-end`}
        backdropOpacity={0.2}
        animationInTiming={200}
      >
        <View
          style={tw`items-center rounded-[8] bg-white p-6 dark:bg-neutral-700`}
        >
          <View style={tw`w-full flex-row items-start justify-between`}>
            <Caption
              text={t`Choose planned day for the test`}
              style={'pb-6 pt-0'}
            />
            <Pressable
              onPress={() => {
                setModalVisible(false);
              }}
              style={tw`rounded-full bg-primary-200/70 p-1 dark:bg-neutral-600/50`}
            >
              <Ionicons
                name='close'
                size={24}
                color={
                  tw.prefixMatch('dark')
                    ? tw.color('primary-100/50')
                    : tw.color(`primary-800`)
                }
              />
            </Pressable>
          </View>
          <DatePicker mode='date' date={dueDate} onDateChange={setDueDate} />
        </View>
      </Modal>
    </View>
  );
}
