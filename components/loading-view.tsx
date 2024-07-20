import { ActivityIndicator, View } from 'react-native';
import tw from '@/lib/tailwind';

export default function LoadingView() {
  return (
    <View
      style={tw`flex-1 items-center justify-center bg-secondary-100 dark:bg-primary-950`}
    >
      <ActivityIndicator size={'large'} />
    </View>
  );
}
