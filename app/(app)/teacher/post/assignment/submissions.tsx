import { ScrollView, Text, View } from 'react-native';
import React from 'react';
import tw from '@/lib/tailwind';
import List from '@/components/list';
import ListItem from '@/components/list-item';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Submissions() {
  const submissions = [
    {
      member: {
        id: 1,
        name: 'John Doe'
      },
      submitted: new Date().toISOString(),
      grade: 10,
      comment: 'Good job!'
    },
    {
      member: {
        id: 2,
        name: 'Jane Doe'
      },
      submitted: new Date().toISOString(),
      grade: 9,
      comment: 'Good job!'
    },
    {
      member: {
        id: 3,
        name: 'John Doe'
      },
      submitted: new Date().toISOString(),
      grade: 10,
      comment: 'Good job!'
    },
    {
      member: {
        id: 4,
        name: 'Jane Doe'
      },
      submitted: new Date().toISOString(),
      grade: null,
      comment: 'Good job!'
    }
  ];

  return (
    <ScrollView style={tw`bg-secondary-100 px-4 dark:bg-primary-950`}>
      <List>
        {submissions.map((submission, index) => (
          <ListItem
            text={submission.member.name}
            key={index}
            rightComponent={
              <View style={tw`flex-row`}>
                <View>
                  <Text>{submission.submitted}</Text>
                  <Text>grade</Text>
                </View>
                <View>
                  <Text>{submission.grade}</Text>
                  <Text>grade</Text>
                </View>
                <Ionicons
                  name='chevron-forward'
                  size={20}
                  color={
                    tw.prefixMatch('dark')
                      ? 'rgba(255, 255, 255, 0.4)'
                      : 'rgba(0, 0, 0, 0.4)'
                  }
                />
              </View>
            }
          />
        ))}
      </List>
    </ScrollView>
  );
}
