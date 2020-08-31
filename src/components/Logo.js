import React from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {theme, storageKey} from '../constants';
import AsyncStorage from '@react-native-community/async-storage';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Toast from 'react-native-simple-toast';

import Deejay from './logo-deejay.svg';

export default function Logo({width = 45, height = 45, containerStyle, ...rest}) {
  return (
    <Pressable
      onLongPress={() => {
        AsyncStorage.removeItem(storageKey)
          .then(() => {
            Toast.show('Storage cleaned');
            ReactNativeHapticFeedback.trigger('impactMedium', {
              enableVibrateFallback: true,
              ignoreAndroidSystemSettings: false,
            });
          })
          .catch((e) => console.log('storage clean'));
      }}
    >
      <View width={width} height={height} style={{...containerStyle, ...styles.container}} {...rest}>
        <Deejay />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.deejay,
    padding: 3,
    borderRadius: 5,
  },
});
