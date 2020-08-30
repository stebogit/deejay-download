import React, {useState} from 'react';
import {Modal, StyleSheet, Text, View, Alert} from 'react-native';
import {Button, colors, Divider} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {requestPermission, isPermissionGranted} from './permissions';
import RNFS from 'react-native-fs'; // https://github.com/itinance/react-native-fs
import ProgressBar from 'react-native-progress/Bar';

export default function Details({data, show, onHide}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [jobId, setJobId] = useState(-1);
  const [progress, setProgress] = useState(0);

  const onDownload = async () => {
    const granted = await isPermissionGranted();
    if (!granted) {
      const success = await requestPermission();
      if (!success) {
        Alert.alert("Sorry, don't have permission to write to your device... :(");
        return;
      }
    }

    const djciDir = `${RNFS.ExternalStorageDirectoryPath}/DJCI`;
    const finalDest = `${djciDir}/${data.filename}`;
    const tempDest = `${RNFS.TemporaryDirectoryPath}/${data.filename}`;
    await RNFS.mkdir(djciDir); // just in case

    setIsDownloading(true);

    const ret = RNFS.downloadFile({
      fromUrl: data.url,
      toFile: tempDest,
      begin: (res) => {},
      progress: (data) => {
        const percentage = Math.round((data.bytesWritten / data.contentLength) * 100) / 100;
        setProgress(percentage);
      },
      progressDivider: 5,
    });

    setJobId(ret.jobId);

    ret.promise
      .then(async (res) => {
        console.log(tempDest);
        await RNFS.moveFile(tempDest, finalDest);
      })
      .catch(async (err) => {
        // even if process was cancelled, the partial file will remain on the filesystem
        const exists = await RNFS.exists(tempDest);
        if (exists) await RNFS.unlink(tempDest);
        const processCancelled = err.code === 'EUNSPECIFIED' && jobId === -1;
        if (!processCancelled) {
          Alert.alert(`ERROR: Code: ${err.code} Message: ${err.message}`);
          console.error('Download error', err);
        }
      })
      .finally(() => {
        setIsDownloading(false);
        setProgress(0);
        setJobId(-1);
      });
  };

  const stopDownload = () => {
    if (jobId !== -1) RNFS.stopDownload(jobId);
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
          {isDownloading && (
            <View style={styles.progressView}>
              <ProgressBar progress={progress} height={2} width={null} />
            </View>
          )}
          {isDownloading ? (
            <Button
              title="Stop"
              icon={<Icon name="cancel" size={20} color={colors.primary} />}
              onPress={stopDownload}
              type="outline"
            />
          ) : (
            <Button
              title="Close"
              icon={<Icon name="close" size={20} color={colors.primary} />}
              onPress={onHide}
              type="outline"
            />
          )}
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
  },
  progressView: {
    marginTop: -25,
    marginBottom: 20,
    width: '100%',
  },
  linksItem: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
});
