import React from 'react';
import Modal from 'react-native-modal';
import tw from '@/lib/tailwind';
import { Pressable, useWindowDimensions, View } from 'react-native';
import Caption from '@/components/caption';
import Ionicons from '@expo/vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function GeneralModal({
  title,
  children,
  visible,
  setVisible
}: {
  title: string;
  children: React.ReactNode;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { height } = useWindowDimensions();

  return (
    <Modal
      animationIn={'slideInUp'}
      isVisible={visible}
      onBackdropPress={() => {
        setVisible(false);
      }}
      onSwipeComplete={() => {
        setVisible(false);
      }}
      swipeDirection={['down']}
      propagateSwipe={true}
      style={tw`mx-4 mb-8 justify-end`}
      backdropOpacity={0.2}
      animationInTiming={200}
    >
      <KeyboardAwareScrollView
        contentContainerStyle={tw`justify-end h-${(height - 55) / 4}`}
      >
        <Pressable
          style={tw`h-${(height - 55) / 4} flex-1 justify-end`}
          onPress={() => setVisible(false)}
        >
          <View style={tw`rounded-[8] bg-white p-6 dark:bg-neutral-700`}>
            <View style={tw`flex-row items-start justify-between gap-4`}>
              <Caption text={title} style={'flex-1 pb-6 pt-0'} />
              <Pressable
                onPress={() => {
                  setVisible(false);
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
            <View style={tw`max-h-[${(height - 250) / 4}]`}>{children}</View>
          </View>
        </Pressable>
      </KeyboardAwareScrollView>
    </Modal>
  );
}
