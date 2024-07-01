import { Text, View } from 'react-native';
import { useGlobalView } from '@/data/global-view';
import { Redirect } from 'expo-router';

export default function Index() {
  const { view } = useGlobalView();

  return <Redirect href={`/${view}`} />;
  // return (
  //   <View>
  //     <Text className='pt-20 text-red-500'>ceva</Text>
  //   </View>
  // );
}
