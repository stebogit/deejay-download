import React from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';

function Loader({show}) {
  if (!show) return null;
  return (
    <View style={styles.container}>
      <View style={styles.view}>
        <ActivityIndicator style={styles.spinner} color="#999999" size={80} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 10,
  },
  view: {
    backgroundColor: '#ddd',
    height: '100%',
    opacity: 0.6,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  spinner: {
    flex: 1,
    top: '-20%',
  },
});

export default Loader;
