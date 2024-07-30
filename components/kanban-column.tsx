import { Post, TeacherPost } from '@/api/post';
import { ScrollView, Text, View } from 'react-native';
import tw from '@/lib/tailwind';
import SmallAssignmentCard from '@/components/small-assignment-card';
import React from 'react';
import { router } from 'expo-router';

export default function KanbanColumn({
  title,
  posts,
  type
}: {
  title: string;
  posts: Post[] | TeacherPost[];
  type: 'student' | 'teacher';
}) {
  return (
    <ScrollView style={tw`mr-6 w-72`}>
      <View style={tw`flex-row justify-between pb-2`}>
        <Text
          style={tw`text-lg font-bold text-primary-800 dark:text-primary-50`}
        >
          {title}
        </Text>
        <Text
          style={tw`text-lg font-bold text-primary-700 dark:text-primary-100`}
        >
          {posts.length}
        </Text>
      </View>
      <View style={tw`gap-2`}>
        {posts.map((item, index) => (
          <SmallAssignmentCard
            assignment={item}
            key={index}
            onPress={() => {
              router.push({
                pathname: `/${type}/post/assignment`,
                params: {
                  postID: item.id
                }
              });
            }}
          />
        ))}
      </View>
    </ScrollView>
  );
}
