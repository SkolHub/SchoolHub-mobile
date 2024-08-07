import React from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import {
  Post,
  TeacherPost,
  useGetTeacherOrganizationAssignments
} from '@/api/post';
import LoadingView from '@/components/loading-view';
import ErrorView from '@/components/error-view';
import tw from '@/lib/tailwind';
import KanbanColumn from '@/components/kanban-column';
import { t } from '@lingui/macro';

export default function Assignments() {
  const posts = useGetTeacherOrganizationAssignments();

  if (posts.isPending) {
    return <LoadingView />;
  }

  if (posts.isError) {
    return <ErrorView refetch={posts.refetch} error={posts.error.message} />;
  }

  let ongoingAssignments: TeacherPost[] = [];
  let noDueDateAssignments: TeacherPost[] = [];

  posts.data.forEach((assignment) => {
    if (!assignment.dueDate) {
      noDueDateAssignments.push(assignment);
    } else if (new Date(assignment.dueDate).getTime() >= new Date().getTime()) {
      ongoingAssignments.push(assignment);
    }
  });

  return (
    <View style={tw`flex-1 bg-secondary-100 px-4 dark:bg-primary-950`}>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={posts.isPending}
            onRefresh={posts.refetch}
          />
        }
      >
        <KanbanColumn
          title={t`Ongoing assignments`}
          posts={ongoingAssignments}
          type={'teacher'}
          key={1}
        />
        <KanbanColumn
          title={t`No due date`}
          posts={noDueDateAssignments}
          type={'teacher'}
          key={2}
        />
      </ScrollView>
    </View>
  );
}
