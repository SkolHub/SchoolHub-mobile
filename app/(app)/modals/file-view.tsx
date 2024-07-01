import { ActivityIndicator, View } from 'react-native';
import React from 'react';
import WebView from 'react-native-webview';
import { useLocalSearchParams } from 'expo-router';

export default function FileView() {
  const { uri } = useLocalSearchParams();

  return (
    <View style={{ flex: 1 }}>
      <WebView
        style={{ flex: 1 }}
        source={{ uri: uri as string }}
        scalesPageToFit={true}
        startInLoadingState={true}
        renderLoading={() => <ActivityIndicator size='large' />}
      />
    </View>
  );
}
