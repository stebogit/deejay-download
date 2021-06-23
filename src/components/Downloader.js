import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Alert} from 'react-native';
// https://github.com/react-native-elements/react-native-elements/blob/next/src/config/colors.js
import {Button, colors} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {requestPermission, isPermissionGranted} from './permissions';
import RNFS from 'react-native-fs'; // https://github.com/itinance/react-native-fs
import ProgressBar from 'react-native-progress/Bar';
import Toast from 'react-native-simple-toast';

export default function Downloader({data, onDownloadStart, onDownloadEnd, style = {}}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [jobId, setJobId] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [exists, setExists] = useState(0);

  const localDir = `${RNFS.ExternalStorageDirectoryPath}/DJCI`;
  const fileDestination = `${localDir}/${data.fileName}`;

  useEffect(() => {
    setExists(0);
    RNFS.exists(fileDestination).then((file) => setExists(file ? 1 : -1));
  }, [fileDestination]);

  const download = async () => {
    const granted = await isPermissionGranted();
    if (!granted) {
      const success = await requestPermission();
      if (!success) {
        Alert.alert("Sorry, don't have permission to write to your device... :(");
        return;
      }
    }

    const tempDest = `${RNFS.TemporaryDirectoryPath}/${data.fileName}`;
    await RNFS.mkdir(localDir); // just in case

    setIsDownloading(true);
    onDownloadStart();

    const ret = RNFS.downloadFile({
      fromUrl: data.url,
      toFile: tempDest,
      begin: (res) => {
        // console.log('Download started: ', data.url);
      },
      progress: (data) => {
        const percentage = Math.round((data.bytesWritten / data.contentLength) * 100) / 100;
        // console.log(`Progress ${percentage * 100}%`);
        setProgress(percentage);
      },
      progressDivider: 5,
    });

    setJobId(ret.jobId);

    ret.promise
      .then(async (res) => {
        const info = await RNFS.stat(tempDest).catch(console.error);
        // console.log(info);
        if (info.size === 0) {
          Toast.show(`Ooops, ${data.fileName} is not available...`);
        } else {
          await RNFS.moveFile(tempDest, fileDestination).catch(console.error);
          setExists(1);
          Toast.show(`${data.fileName} is ready!`);
        }
      })
      .catch(async (err) => {
        // even if process was cancelled, the partial file will remain on the filesystem
        // console.log(err);
        const fileExists = await RNFS.exists(tempDest).catch(console.error);
        if (fileExists) await RNFS.unlink(tempDest).catch(console.error);
        const processCancelled = err.code === 'EUNSPECIFIED' && jobId === -1;
        if (!processCancelled) {
          Alert.alert(`ERROR: Code: ${err.code} Message: ${err.message}`);
          console.error('Download error', err);
        }
      })
      .finally(() => {
        // console.log('finally');
        setIsDownloading(false);
        setProgress(0);
        setJobId(-1);
        onDownloadEnd();
      });
  };

  const stopDownload = () => {
    if (jobId !== -1) {
      // console.log(`Download ${data.fileName} cancelled`);
      RNFS.stopDownload(jobId);
    }
  };

  if (!data) return null;
  return (
    <View style={style}>
      <View style={styles.container}>
        <Text style={styles.item}>
          <Icon
            name={
              isDownloading || exists === 0
                ? 'progress-check'
                : exists === 1
                ? 'check-circle'
                : 'checkbox-blank-circle-outline'
            }
            size={15}
            color={exists === 1 ? 'green' : 'lightgrey'}
          />{' '}
          {data.showName}
        </Text>
        <Button
          style={styles.item}
          icon={<Icon name={isDownloading ? 'cancel' : 'download'} size={20} color={'white'} />}
          onPress={isDownloading ? stopDownload : download}
        />
      </View>
      {isDownloading && (
        <View style={styles.progressView}>
          <ProgressBar
            progress={progress}
            height={2}
            width={null}
            borderWidth={0}
            color={colors.primary}
            borderColor={colors.primary}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 20,
    width: '80%',
    marginHorizontal: '10%',
  },
  progressView: {
    display: 'flex',
    marginTop: -12,
    marginBottom: 10,
    width: '80%',
    marginHorizontal: '10%',
  },
  item: {
    flex: 1,
  },
});
