import { ActivityIndicator, View } from 'react-native';
import tw from '@/lib/tailwind';

export default function LoadingView() {
  return (
    <View style={tw`flex-1 items-center justify-center dark:bg-black`}>
      <ActivityIndicator size={'large'} />
    </View>
  );
}
