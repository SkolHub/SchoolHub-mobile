import { FlatList, Pressable, RefreshControl, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import tw from '@/lib/tailwind';
import { useGetFewGrades, useGetTeacherSubjectStats } from '@/api/subject';
import { TeacherPost, useGetTeacherSubjectPosts } from '@/api/post';
import LoadingView from '@/components/loading-view';
import ErrorView from '@/components/error-view';
import StatsSummaryView from '@/components/stats-summary-view';
import SmallButton from '@/components/small-button';
import FilterDropdown from '@/components/filter-dropdown';
import { PostsListItem } from '@/components/posts-list-item';
import Modal from 'react-native-modal';
import Caption from '@/components/caption';
import Ionicons from '@expo/vector-icons/Ionicons';
import { t } from '@lingui/macro';

export default function Index() {
  const { subjectID } = useLocalSearchParams();
  const stats = useGetTeacherSubjectStats(subjectID as string);
  const fewGrades = useGetFewGrades(subjectID as string);

  const posts = useGetTeacherSubjectPosts(subjectID as string);

  const [shownPosts, setShownPosts] = useState<TeacherPost[]>([]);
  const [filter, setFilter] = useState<string[]>([
    'announcement',
    'assignment',
    'material',
    'test'
  ]);

  const [toolsModalVisible, setToolsModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);

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

  if (stats.isPending || posts.isPending || fewGrades.isPending) {
    return <LoadingView />;
  }

  if (stats.isError) {
    return <ErrorView refetch={stats.refetch} error={stats.error.message} />;
  }

  if (posts.isError) {
    return <ErrorView refetch={posts.refetch} error={posts.error.message} />;
  }

  if (fewGrades.isError) {
    return (
      <ErrorView refetch={fewGrades.refetch} error={fewGrades.error.message} />
    );
  }

  posts.data.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <View style={tw`flex-1 bg-secondary-100 px-4 dark:bg-primary-950`}>
      <FlatList
        ListHeaderComponent={
          <>
            <StatsSummaryView
              data={[
                {
                  label: t`average grades`,
                  value: (+stats.data.averagecount).toFixed(1).toString()
                },
                {
                  label: t`class average`,
                  value: (+stats.data.average).toFixed(2).toString()
                },
                {
                  label: t`students with few grades`,
                  value: fewGrades.data.count
                }
              ]}
              style={`mb-4`}
            />
            <View style={tw`flex-row items-start justify-between pb-4`}>
              <View style={tw`flex-row gap-2`}>
                <SmallButton
                  text={t`Create`}
                  iconName={'add-outline'}
                  onPress={() => {
                    setCreateModalVisible(true);
                  }}
                />
                <SmallButton
                  text={t`Tools`}
                  iconName={'hammer'}
                  onPress={() => {
                    setToolsModalVisible(true);
                  }}
                />
              </View>
              <FilterDropdown filter={filter} setFilter={setFilter} />
            </View>
          </>
        }
        refreshControl={
          <RefreshControl
            refreshing={stats.isPending || posts.isPending}
            onRefresh={async () => {
              await Promise.all([stats.refetch(), posts.refetch()]);
            }}
          />
        }
        data={shownPosts}
        renderItem={({ item }) => {
          return (
            <PostsListItem
              subjectID={subjectID as string}
              post={item}
              userType={'teacher'}
            />
          );
        }}
      />
      <Modal
        animationIn={'slideInUp'}
        isVisible={createModalVisible}
        onBackdropPress={() => {
          setCreateModalVisible(false);
        }}
        onSwipeComplete={() => {
          setCreateModalVisible(false);
        }}
        swipeDirection={['down']}
        style={tw`mx-4 mb-8 justify-end`}
        backdropOpacity={0.2}
        animationInTiming={200}
      >
        <View style={tw`rounded-[8] bg-white p-6 dark:bg-neutral-700`}>
          <View style={tw`flex-row items-start justify-between`}>
            <Caption text={t`Create`} style={'pb-6 pt-0'} />
            <Pressable
              onPress={() => {
                setCreateModalVisible(false);
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
          <View style={tw`gap-2.5`}>
            <SmallButton
              text={t`Assignment`}
              onPress={() => {
                setCreateModalVisible(false);
                setTimeout(() => {
                  router.push({
                    pathname: '/modals/create-assignment',
                    params: {
                      subjectID: subjectID as string
                    }
                  });
                }, 400);
              }}
              contentContainerStyle={'bg-neutral-200/70 dark:bg-neutral-600'}
              iconName={'document-attach'}
            />
            <SmallButton
              text={t`Announcement`}
              onPress={() => {
                setCreateModalVisible(false);
                setTimeout(() => {
                  router.push({
                    pathname: '/modals/create-announcement',
                    params: {
                      subjectID: subjectID as string,
                      userType: 'teacher'
                    }
                  });
                }, 400);
              }}
              contentContainerStyle={'bg-neutral-200/70 dark:bg-neutral-600'}
              iconName={'chatbubbles'}
            />
            <SmallButton
              text={t`Material`}
              onPress={() => {
                setCreateModalVisible(false);
                setTimeout(() => {
                  router.push({
                    pathname: '/modals/create-material',
                    params: {
                      subjectID: subjectID as string
                    }
                  });
                }, 400);
              }}
              contentContainerStyle={'bg-neutral-200/70 dark:bg-neutral-600'}
              iconName={'document-text'}
            />
            <SmallButton
              text={t`Test`}
              onPress={() => {
                setCreateModalVisible(false);
                setTimeout(() => {
                  router.push({
                    pathname: '/modals/create-test',
                    params: {
                      subjectID: subjectID as string
                    }
                  });
                }, 400);
              }}
              contentContainerStyle={'bg-neutral-200/70 dark:bg-neutral-600'}
              iconName={'list'}
            />
          </View>
        </View>
      </Modal>
      <Modal
        animationIn={'slideInUp'}
        isVisible={toolsModalVisible}
        onBackdropPress={() => {
          setToolsModalVisible(false);
        }}
        onSwipeComplete={() => {
          setToolsModalVisible(false);
        }}
        swipeDirection={['down']}
        style={tw`mx-4 mb-8 justify-end`}
        backdropOpacity={0.2}
        animationInTiming={200}
      >
        <View style={tw`rounded-[8] bg-white p-6 dark:bg-neutral-700`}>
          <View style={tw`flex-row items-start justify-between`}>
            <Caption text={t`Tools`} style={'pb-6 pt-0'} />
            <Pressable
              onPress={() => {
                setToolsModalVisible(false);
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
          <View style={tw`gap-2.5`}>
            <SmallButton
              text={t`Grade the class`}
              onPress={() => {
                setToolsModalVisible(false);
                setTimeout(() => {
                  router.push({
                    pathname: '/modals/grade-mode',
                    params: {
                      subjectID: subjectID as string
                    }
                  });
                }, 400);
              }}
              contentContainerStyle={'bg-neutral-200/70 dark:bg-neutral-600'}
              iconName={'stats-chart'}
            />
            <SmallButton
              text={t`Attendance mode`}
              onPress={() => {
                setToolsModalVisible(false);
                setTimeout(() => {
                  router.push({
                    pathname: '/modals/attendance-mode',
                    params: {
                      subjectID: subjectID as string
                    }
                  });
                }, 400);
              }}
              contentContainerStyle={'bg-neutral-200/70 dark:bg-neutral-600'}
              iconName={'calendar'}
            />
            <SmallButton
              text={t`Assessment mode`}
              onPress={() => {
                setToolsModalVisible(false);
                setTimeout(() => {
                  router.push({
                    pathname: '/modals/assessment',
                    params: {
                      subjectID: subjectID as string
                    }
                  });
                }, 400);
              }}
              contentContainerStyle={'bg-neutral-200/70 dark:bg-neutral-600'}
              iconName={'list'}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
