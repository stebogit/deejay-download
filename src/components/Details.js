import React, {useState} from 'react';
import {Modal, StyleSheet, Text, View} from 'react-native';
import {Button, colors, Divider} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import {highlightBorder} from '../constants';
// import axios from 'axios';

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
          <View style={styles.modalTitle}>
            <Text style={styles.title}>{data.date}</Text>
          </View>
          <Divider />
          <View style={styles.linksView}>
            <Text>DJ Chiama Italia</Text>
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
  modalTitle: {
    paddingBottom: 10,
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
    width: 300,
  },
  linksView: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 20,
    width: '100%',
    // ...highlightBorder('red'),
  },
  linksItem: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
});
