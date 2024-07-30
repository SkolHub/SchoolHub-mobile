import { Post, TeacherPost } from '@/api/post';
import { Pressable, Text, View } from 'react-native';
import tw from '@/lib/tailwind';
import { androidRipple, formatShortDate, formatTime } from '@/lib/utils';
import React from 'react';
import { t } from '@lingui/macro';

export default function SmallAssignmentCard({
  assignment,
  onPress
}: {
  assignment: Post | TeacherPost;
  onPress: () => void;
}) {
  return (
    <View style={tw`overflow-hidden rounded-2xl`}>
      <Pressable
        onPress={onPress}
        android_ripple={androidRipple}
        style={tw`flex-row justify-between rounded-2xl bg-neutral-50 px-4 py-3 dark:bg-neutral-700`}
      >
        <View style={tw`flex-1`}>
          <Text
            style={tw`text-base font-semibold text-primary-800 dark:text-primary-50`}
          >
            {assignment.title}
          </Text>
          <Text
            style={tw`text-sm font-semibold text-primary-700 dark:text-primary-200`}
          >
            {assignment.subjectName + ' - ' + assignment.classes?.join(', ')}
          </Text>
        </View>
        <View style={tw`max-w-1/3 items-end`}>
          <Text
            style={tw`text-right text-sm font-semibold text-primary-700 dark:text-primary-200`}
          >
            {assignment.dueDate
              ? t`Due ${formatShortDate(assignment.dueDate)}`
              : t`No due date`}
          </Text>
          <Text
            style={tw`text-right text-sm font-semibold text-primary-700 dark:text-primary-200`}
          >
            {assignment.dueDate && formatTime(assignment.dueDate)}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}
