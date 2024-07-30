import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LargeButton from '@/components/large-button';
import tw from '@/lib/tailwind';
import { t, Trans } from '@lingui/macro';

export default function ErrorView({
  refetch,
  error
}: {
  refetch: () => void;
  error: string;
}) {
  return (
    <View
      style={tw`w-full flex-1 items-center justify-center bg-secondary-100 dark:bg-primary-950`}
    >
      <Ionicons
        name='cloud-offline-outline'
        size={100}
        color={
          tw.prefixMatch('dark')
            ? 'rgba(255, 255, 255, 0.5)'
            : 'rgba(0, 0, 0, 0.5)'
        }
      />
      <Text style={tw`text-lg text-black dark:text-white`}>
        <Trans>There was a problem while loading.</Trans>
      </Text>
      <Text style={tw`text-lg text-black dark:text-white`}>{error}</Text>
      <LargeButton
        text={t`Retry`}
        onPress={() => refetch()}
        style={`mt-4 w-1/3`}
      />
      {/*<LargeButton*/}
      {/*  text={'logout'}*/}
      {/*  onPress={() => setSession(null)}*/}
      {/*  style={`mt-4 w-1/3`}*/}
      {/*/>*/}
    </View>
  );
}
