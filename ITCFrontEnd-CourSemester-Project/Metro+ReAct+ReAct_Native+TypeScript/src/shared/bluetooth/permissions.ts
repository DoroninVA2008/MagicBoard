import { PermissionsAndroid, Platform } from 'react-native'

export async function requestBlePermissions(): Promise<boolean> {
  if (Platform.OS !== 'android') return true;
  if (Platform.Version >= 31) {
    const res = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    ]);
    return Object.values(res).every((v) => v === PermissionsAndroid.RESULTS.GRANTED);
  }
  const res = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );
  return res === PermissionsAndroid.RESULTS.GRANTED;
}