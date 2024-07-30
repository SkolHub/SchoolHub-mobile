import { FlatList, RefreshControl, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import tw from '@/lib/tailwind';
import { useGetSubjectStats } from '@/api/subject';
import LoadingView from '@/components/loading-view';
import ErrorView from '@/components/error-view';
import { Post, useGetStudentSubjectPosts } from '@/api/post';
import SmallButton from '@/components/small-button';
import FilterDropdown from '@/components/filter-dropdown';
import StatsSummaryView from '@/components/stats-summary-view';
import { PostsListItem } from '@/components/posts-list-item';
import { t } from '@lingui/macro';

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
    <View style={tw`flex-1 bg-secondary-100 px-4 dark:bg-primary-950`}>
      <FlatList
        ListHeaderComponent={
          <>
            <View style={tw`pb-4`}>
              <StatsSummaryView
                data={[
                  {
                    label: t`assignments`,
                    value: subjectStats.data.assignments.toString()
                  },
                  {
                    label: t`overall average`,
                    value: subjectStats.data.average.toFixed(2)
                  },
                  {
                    label: t`unexcused absences`,
                    value: subjectStats.data.absences.toString()
                  }
                ]}
              />
            </View>
            <View style={tw`flex-row items-start justify-between pb-4`}>
              <SmallButton
                text={t`Create post`}
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
            onRefresh={async () => {
              await Promise.all([subjectStats.refetch(), posts.refetch()]);
            }}
          />
        }
        data={shownPosts}
        renderItem={({ item }) => {
          return (
            <PostsListItem
              post={item}
              userType={'student'}
              subjectID={subjectID as string}
            />
          );
        }}
      />
    </View>
  );
}
