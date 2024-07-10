import { FlatList, RefreshControl, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import AssignmentCard from '@/components/assignment-card';
import AnnouncementCard from '@/components/announcement-card';
import tw from '@/lib/tailwind';
import { useGetSubjectStats } from '@/api/subject';
import LoadingView from '@/components/loading-view';
import ErrorView from '@/components/error-view';
import { Post, useGetStudentSubjectPosts } from '@/api/post';
import SmallButton from '@/components/small-button';
import FilterDropdown from '@/components/filter-dropdown';
import { formatShortDate, formatTime } from '@/lib/utils';
import MaterialCard from '@/components/material-card';
import TestCard from '@/components/test-card';

export default function Index() {
  const { subjectID } = useLocalSearchParams();

  const subjectStats = useGetSubjectStats(subjectID as string);
  const posts = useGetStudentSubjectPosts(subjectID as string);

  const [shownPosts, setShownPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<string[]>([
    'announcement',
    'assignment',
    'material',
    'test'
  ]);

  useEffect(() => {
    if (posts.data) {
      let temp = posts.data.filter((p) => filter.includes(p.type));
      temp = temp.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setShownPosts(temp);
    }
  }, [posts.data, filter]);

  if (subjectStats.isPending || posts.isPending) {
    return <LoadingView />;
  }

  if (subjectStats.isError) {
    return (
      <ErrorView
        refetch={subjectStats.refetch}
        error={subjectStats.error.message}
      />
    );
  }

  if (posts.isError) {
    return <ErrorView refetch={posts.refetch} error={posts.error.message} />;
  }

  posts.data.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <View style={tw`flex-1 bg-secondary-50 px-4 dark:bg-primary-950`}>
      <FlatList
        ListHeaderComponent={
          <>
            <View
              style={tw`mb-6 rounded-3xl bg-neutral-50 p-4 dark:bg-neutral-700`}
            >
              <View style={tw`flex-row justify-between`}>
                <View
                  style={tw`flex-1 items-stretch border-r border-black/15 pr-4 dark:border-white/20`}
                >
                  <Text
                    style={tw`text-center text-xl font-bold text-primary-800 dark:text-primary-50`}
                  >
                    {subjectStats.data.assignments}
                  </Text>
                  <Text
                    style={tw`flex-1 text-center text-sm font-semibold text-primary-700 dark:text-primary-200`}
                  >
                    assignments
                  </Text>
                </View>
                <View
                  style={tw`flex-1 items-stretch border-r border-black/15 px-4 dark:border-white/20`}
                >
                  <Text
                    style={tw`text-center text-xl font-bold text-primary-800 dark:text-primary-50`}
                  >
                    {subjectStats.data.average.toFixed(2) ?? 'No grades'}
                  </Text>
                  <Text
                    style={tw`text-center text-sm font-semibold text-primary-700 dark:text-primary-200`}
                  >
                    overall average
                  </Text>
                </View>
                <View style={tw`flex-1 items-stretch pl-4`}>
                  <Text
                    style={tw`text-center text-xl font-bold text-primary-800 dark:text-primary-50`}
                  >
                    {subjectStats.data.absences}
                  </Text>
                  <Text
                    style={tw`text-center text-sm font-semibold text-primary-700 dark:text-primary-200`}
                  >
                    unexcused absences
                  </Text>
                </View>
              </View>
            </View>

            <View style={tw`mb-4 flex-row items-start justify-between`}>
              <SmallButton
                text={'Create post'}
                iconName={'add-outline'}
                onPress={() => {
                  router.push({
                    pathname: '/modals/create-announcement',
                    params: {
                      subjectID: subjectID,
                      userType: 'student'
                    }
                  });
                }}
              />
              <FilterDropdown filter={filter} setFilter={setFilter} />
            </View>
          </>
        }
        refreshControl={
          <RefreshControl
            refreshing={subjectStats.isPending || posts.isPending}
            onRefresh={() => {
              Promise.all([subjectStats.refetch(), posts.refetch()]);
            }}
          />
        }
        data={shownPosts}
        renderItem={({ item }) => {
          if (item.type === 'material') {
            return (
              <MaterialCard
                onPress={() => {
                  router.push({
                    pathname: '/student/post/material',
                    params: {
                      postID: item.id
                    }
                  });
                }}
                title={item.title}
                date={formatShortDate(item.timestamp)}
              />
            );
          }
          if (item.type === 'assignment') {
            return (
              <AssignmentCard
                onPress={() => {
                  router.push({
                    pathname: '/student/post/assignment',
                    params: {
                      postID: item.id
                    }
                  });
                }}
                title={item.title}
                date={formatShortDate(item.timestamp)}
                dueDate={
                  item.dueDate
                    ? formatShortDate(item.dueDate) +
                      ', ' +
                      formatTime(item.dueDate)
                    : null
                }
              />
            );
          }
          if (item.type === 'announcement') {
            return (
              <AnnouncementCard
                title={item.title}
                body={item.body}
                date={`${new Date(item.timestamp)
                  .getDate()
                  .toString()
                  .padStart(2, '0')}.${(new Date(item.timestamp).getMonth() + 1)
                  .toString()
                  .padStart(2, '0')}.${new Date(item.timestamp).getFullYear()}`}
                onPress={() => {
                  router.push({
                    pathname: '/student/post/announcement',
                    params: {
                      postID: item.id
                    }
                  });
                }}
              />
            );
          }
          if (item.type === 'test') {
            return (
              <TestCard
                onPress={() => {
                  router.push({
                    pathname: '/student/post/test',
                    params: {
                      postID: item.id
                    }
                  });
                }}
                title={item.title}
                date={formatShortDate(item.timestamp)}
                dueDate={formatShortDate(item.dueDate)}
              />
            );
          }
          return null;
        }}
      />
    </View>
  );
}
