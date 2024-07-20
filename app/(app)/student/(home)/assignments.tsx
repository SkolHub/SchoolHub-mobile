import { RefreshControl, ScrollView, View } from 'react-native';
import tw from '@/lib/tailwind';
import { Post, useGetStudentOrganizationAssignments } from '@/api/post';
import React from 'react';
import LoadingView from '@/components/loading-view';
import ErrorView from '@/components/error-view';
import KanbanColumn from '@/components/kanban-column';

export default function Assignments() {
  const assignments = useGetStudentOrganizationAssignments();

  if (assignments.isPending) {
    return <LoadingView />;
  }

  if (assignments.isError) {
    return (
      <ErrorView
        refetch={assignments.refetch}
        error={assignments.error.message}
      />
    );
  }

  let missingAssignments: Post[] = [];
  let noDueDateAssignments: Post[] = [];
  let thisWeekAssignments: Post[] = [];
  let laterAssignments: Post[] = [];

  assignments.data.forEach((assignment) => {
    if (!assignment.dueDate) {
      noDueDateAssignments.push(assignment);
    } else if (new Date(assignment.dueDate).getTime() < new Date().getTime()) {
      missingAssignments.push(assignment);
    } else if (
      new Date(assignment.dueDate).getTime() <
      new Date().getTime() + 7 * 24 * 60 * 60 * 1000
    ) {
      thisWeekAssignments.push(assignment);
    } else {
      laterAssignments.push(assignment);
    }
  });

  return (
    <View style={tw`flex-1 bg-secondary-100 px-4 dark:bg-primary-950`}>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={assignments.isPending}
            onRefresh={assignments.refetch}
          />
        }
      >
        <KanbanColumn
          title={'This week'}
          posts={thisWeekAssignments}
          key={1}
          type={'student'}
        />
        <KanbanColumn
          title={'Later'}
          posts={laterAssignments}
          key={2}
          type={'student'}
        />
        <KanbanColumn
          title={'No due date'}
          posts={noDueDateAssignments}
          key={3}
          type={'student'}
        />
        <KanbanColumn
          title={'Missing'}
          posts={missingAssignments}
          key={4}
          type={'student'}
        />
      </ScrollView>
    </View>
  );
}
