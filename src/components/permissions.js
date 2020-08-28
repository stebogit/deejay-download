import {PermissionsAndroid} from 'react-native';
// See also https://stackoverflow.com/a/58430303/4530144

const READ_PERMISSION = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
const WRITE_PERMISSION = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
const GRANTED = PermissionsAndroid.RESULTS.GRANTED;

export const requestPermission = async () => {
  try {
    const result = await PermissionsAndroid.requestMultiple([READ_PERMISSION, WRITE_PERMISSION]);
    return result[READ_PERMISSION] === GRANTED && result[WRITE_PERMISSION] === GRANTED;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const isPermissionGranted = async () => {
  try {
    const [read, write] = await Promise.all([
      PermissionsAndroid.check(READ_PERMISSION),
      PermissionsAndroid.check(WRITE_PERMISSION),
    ]);
    return read && write;
  } catch (err) {
    console.warn(err);
    return false;
  }
};
