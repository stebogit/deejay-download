import React, {useCallback, useState} from 'react';
import {Modal, StyleSheet, Text, View} from 'react-native';
import {Button, colors, ThemeContext} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

export default function Details({data, show, onHide}) {
  const [isDownloading, setIsDownloading] = useState(false);

  const onDownload = () => {
    // axios.get(data.url);
    setIsDownloading(true);
    setTimeout(() => setIsDownloading(false), 2000);
    console.log('download!');
  };

  if (!data) return null;
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={show}
      onRequestClose={() => {
        onHide();
      }}
    >
      <View style={styles.modal}>
        <View style={styles.modalBody}>
          <View style={styles.linksView}>
            <Text style={styles.linksItem}>{data.date}</Text>
            <Button
              style={styles.linksItem}
              buttonStyle={{width: 110}}
              title="Download"
              icon={<Icon name="download" size={20} color={colors.primary} />}
              loading={isDownloading}
              onPress={onDownload}
              type="clear"
            />
          </View>
          <Button title="Close" onPress={onHide} type="outline" />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  modalBody: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 4,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  linksView: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 20,
  },
  linksItem: {
    flex: 0.5,
  },
});
