import { Text, View } from 'react-native';
import tw from '@/lib/tailwind';
import { formatShortDate } from '@/lib/utils';
import DeleteDropdown from '@/components/delete-dropdown';
import React from 'react';

export default function CommentCard({
  comment,
  deleteComment,
  postID,
  accountID,
  refetch
}: {
  comment: {
    id: number;
    body: string;
    timestamp: string;
    member: {
      id: number;
      name: string;
    };
  };
  deleteComment: any;
  postID: string;
  accountID: any;
  refetch: () => void;
}) {
  return (
    <View style={tw`rounded-2xl bg-white px-4 py-3 pr-1 dark:bg-neutral-700`}>
      <View style={tw`flex-row items-center justify-between`}>
        <View style={tw`w-full flex-row justify-between`}>
          <Text
            style={tw`text-base font-semibold text-primary-800 dark:text-primary-50`}
          >
            {comment.member.name}
          </Text>
          <View style={tw`flex-row items-center`}>
            <Text
              style={tw.style(
                `text-sm font-semibold text-primary-700 dark:text-primary-200`,
                comment.member.id !== +(accountID.data as string)
                  ? tw`mr-2`
                  : tw`mr-0`
              )}
            >
              {formatShortDate(comment.timestamp)}
            </Text>
            {comment.member.id === +(accountID.data as string) ? (
              <DeleteDropdown
                onDelete={async () => {
                  await deleteComment.mutateAsync({
                    id: comment.id,
                    postID: +(postID as string)
                  });
                  refetch();
                }}
              />
            ) : null}
          </View>
        </View>
      </View>
      <Text style={tw`text-base text-primary-800 dark:text-primary-50`}>
        {comment.body.trim()}
      </Text>
    </View>
  );
}
