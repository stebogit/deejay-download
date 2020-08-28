import React, {useState} from 'react';
import {Modal, StyleSheet, Text, View, Alert} from 'react-native';
import {Button, colors, Divider} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {requestPermission, isPermissionGranted} from './permissions';
// import {highlightBorder} from '../constants';
import RNFS from 'react-native-fs';

let jobId = -1;

export default function Details({data, show, onHide}) {
  const [isDownloading, setIsDownloading] = useState(false);

  const onDownload = async () => {
    const granted = await isPermissionGranted();
    if (!granted) {
      const success = await requestPermission();
      if (!success) {
        Alert.alert("Sorry, don't have permission to write to your device... :(");
        return;
      }
    }

    setIsDownloading(true);
    // TODO: check if DJCI folder exists
    const downloadDest = `${RNFS.ExternalStorageDirectoryPath}/DJCI/${data.filename}`;

    const progress = (data) => {
      const percentage = Math.round((100 * data.bytesWritten) / data.contentLength);
      const text = `Progress ${percentage}%`;
      console.log(text);
    };

    const begin = (res) => {
      // TODO: show progress
      // const res5 = {
      //   contentLength: 90490253,
      //   headers: {
      //     'Access-Control-Allow-Origin': '*',
      //     'Akamai-Mon-Iucid-Del': '629184',
      //     Connection: 'keep-alive',
      //     'Content-Length': '90490253',
      //     'Content-Type': 'audio/mpeg',
      //     Date: 'Fri, 28 Aug 2020 15:56:55 GMT',
      //     ETag: 'b6fac9d3a3fee54025aa8d879d0d7f1c-11',
      //     'Last-Modified': 'Wed, 22 Jul 2020 10:21:32 GMT',
      //     Server: 'AmazonS3',
      //     'X-Android-Received-Millis': '1598630214875',
      //     'X-Android-Response-Source': 'NETWORK 200',
      //     'X-Android-Selected-Protocol': 'http/1.1',
      //     'X-Android-Sent-Millis': '1598630213836',
      //     'x-amz-id-2': '8S0scxHxXbksW4J19VyBCzjhVxt8HsOO0RVRkQirE0fqvq6PnRGY38KN0yohqxImI6snFOmvsvQ=',
      //     'x-amz-request-id': '83989DE6D429E4DB',
      //     'x-amz-version-id': 'S4IkbcJtHW2jn4tFSl_2iCrS4hmnj2p9',
      //   },
      //   jobId: 1,
      //   statusCode: 200,
      // };
      console.log('Download has begun', res);
    };

    const ret = RNFS.downloadFile({
      fromUrl: data.url,
      toFile: downloadDest,
      begin,
      progress,
      progressDivider: 10,
    });

    jobId = ret.jobId;

    ret.promise
      .then((res) => {
        // TODO: hide progress
        // res = {bytesWritten: 90490253, statusCode: 200, jobId: 1}
      })
      .catch((err) => {
        Alert.alert(`ERROR: Code: ${err.code} Message: ${err.message}`);
        console.error('Download error', err);
      })
      .finally(() => {
        setIsDownloading(false);
        jobId = -1;
      });
  };

  // TODO add stop download
  const stopDownload = () => {
    if (jobId !== -1) {
      RNFS.stopDownload(jobId);
      jobId = -1;
    }
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
