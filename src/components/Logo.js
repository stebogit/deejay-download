import React from 'react';
import {View, StyleSheet} from 'react-native';
import {theme} from '../constants';

import Deejay from './logo-deejay.svg';

export default function Logo({width = 45, height = 45, containerStyle, ...rest}) {
  return (
    <View width={width} height={height} style={{...containerStyle, ...styles.container}} {...rest}>
      <Deejay />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.deejay,
    padding: 3,
    borderRadius: 5,
  },
});
