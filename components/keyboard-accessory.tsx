import {
  Button,
  InputAccessoryView,
  Keyboard,
  Platform,
  View
} from 'react-native';
import tw from '@/lib/tailwind';

export default function KeyboardAccessory({
  inputAccessoryViewID
}: {
  inputAccessoryViewID: string;
}) {
  if (Platform.OS === 'ios') {
    return (
      <InputAccessoryView
        style={tw`flex-1 items-start`}
        nativeID={inputAccessoryViewID}
      >
        <View style={tw`items-end bg-white py-1 pr-4 dark:bg-black`}>
          <Button title='Done' onPress={Keyboard.dismiss} />
        </View>
      </InputAccessoryView>
    );
  }
  return null;
}
