import { Post } from '@/api/post';
import { Pressable, Text, View } from 'react-native';
import tw from '@/lib/tailwind';
import { androidRipple, formatShortDate, formatTime } from '@/lib/utils';
import React from 'react';
import { router } from 'expo-router';

export default function SmallAssignmentCard({
  assignment
}: {
  assignment: Post;
}) {
  return (
    <View style={tw`overflow-hidden rounded-2xl`}>
      <Pressable
        onPress={() => {
          router.push({
            pathname: '/student/post/assignment',
            params: {
              postID: assignment.id
            }
          });
        }}
        android_ripple={androidRipple}
        style={tw`flex-row justify-between rounded-2xl bg-neutral-50 px-4 py-3 dark:bg-neutral-700`}
      >
        <View>
          <Text
            style={tw`text-base font-semibold text-primary-800 dark:text-primary-50`}
          >
            {assignment.title}
          </Text>
          <Text
            style={tw`text-sm font-semibold text-primary-700 dark:text-primary-200`}
          >
            Fizica
          </Text>
        </View>
        <View style={tw`items-end`}>
          <Text
            style={tw`text-sm font-semibold text-primary-700 dark:text-primary-200`}
          >
            {assignment.dueDate
              ? formatShortDate(assignment.dueDate)
              : 'No due date'}
          </Text>
          <Text
            style={tw`text-sm font-semibold text-primary-700 dark:text-primary-200`}
          >
            {assignment.dueDate && formatTime(assignment.dueDate)}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}
