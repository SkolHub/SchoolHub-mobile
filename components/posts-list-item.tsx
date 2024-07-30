import { Post, TeacherPost } from '@/api/post';
import MaterialCard from '@/components/material-card';
import { router } from 'expo-router';
import AssignmentCard from '@/components/assignment-card';
import AnnouncementCard from '@/components/announcement-card';
import TestCard from '@/components/test-card';
import { formatShortDate, formatTime } from '@/lib/utils';

export function PostsListItem({
  post,
  userType,
  subjectID
}: {
  post: Post | TeacherPost;
  userType: 'student' | 'teacher';
  subjectID: string;
}) {
  if (post.type === 'material') {
    return (
      <MaterialCard
        onPress={() => {
          router.push({
            pathname: `/${userType}/post/material`,
            params: {
              postID: post.id
            }
          });
        }}
        title={post.title}
        date={formatShortDate(post.timestamp)}
      />
    );
  }
  if (post.type === 'assignment') {
    return (
      <AssignmentCard
        onPress={() => {
          router.push({
            pathname: `/${userType}/post/assignment`,
            params: {
              postID: post.id,
              subjectID: subjectID
            }
          });
        }}
        title={post.title}
        date={formatShortDate(post.timestamp)}
        dueDate={
          post.dueDate
            ? formatShortDate(post.dueDate) + ', ' + formatTime(post.dueDate)
            : null
        }
      />
    );
  }
  if (post.type === 'announcement') {
    return (
      <AnnouncementCard
        title={post.title}
        body={post.body}
        date={`${new Date(post.timestamp)
          .getDate()
          .toString()
          .padStart(2, '0')}.${(new Date(post.timestamp).getMonth() + 1)
          .toString()
          .padStart(2, '0')}.${new Date(post.timestamp).getFullYear()}`}
        onPress={() => {
          router.push({
            pathname: `/${userType}/post/announcement`,
            params: {
              postID: post.id
            }
          });
        }}
      />
    );
  }
  if (post.type === 'test') {
    return (
      <TestCard
        onPress={() => {
          router.push({
            pathname: `/${userType}/post/test`,
            params: {
              postID: post.id
            }
          });
        }}
        title={post.title}
        date={formatShortDate(post.timestamp)}
        dueDate={formatShortDate(post.dueDate)}
      />
    );
  }
  return null;
}
