import { BleManager, Device, ConnectionManager } from '@sfourdrinier/react-native-ble-plx'
import { PermissionsAndroid, Platform } from 'react-native'

// UUID твоей доски (замени на реальные из документации)
const SERVICE_UUID = '0000XXXX-0000-1000-8000-00805F9B34FB'; 
const COMMAND_CHAR_UUID = '0000YYYY-0000-1000-8000-00805F9B34FB';
// Стандартные UUID для батареи
const BATTERY_SERVICE_UUID = '180F';
const BATTERY_CHAR_UUID = '2A19';

export const bleManager = new BleManager();
export const connectionManager = new ConnectionManager(bleManager);

// Запрос разрешений
export const requestBlePermissions = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    const apiLevel = Platform.Version;
    if (apiLevel >= 31) {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);
      return (
        granted['android.permission.BLUETOOTH_SCAN'] === 'granted' &&
        granted['android.permission.BLUETOOTH_CONNECT'] === 'granted'
      );
    } else {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      return granted === 'granted';
    }
  }
  return true;
};

// Поиск доски
export const scanForBoard = (
  onDeviceFound: (device: Device) => void,
  onError: (error: Error) => void
) => {
  bleManager.startDeviceScan(null, null, (error, device) => {
    if (error) {
      onError(error);
      return;
    }
    // Ищем по имени (например, 'MagicBoard') или по UUID сервиса
    if (device?.name === 'MagicBoard' || device?.localName === 'MagicBoard') {
      bleManager.stopDeviceScan();
      onDeviceFound(device);
    }
  });
};

// Чтение заряда
export const readBatteryLevel = async (device: Device): Promise<number | null> => {
  try {
    const characteristic = await device.readCharacteristicForService(
      BATTERY_SERVICE_UUID,
      BATTERY_CHAR_UUID
    );
    if (characteristic.value) {
      // Декодируем base64 в число
      const level = parseInt(atob(characteristic.value), 10);
      return level;
    }
  } catch (error) {
    console.warn('Ошибка чтения заряда:', error);
  }
  return null;
};

// Отправка команд (Старт, Пауза, Перемотка)
export const sendCommand = async (device: Device, command: string) => {
  try {
    // Кодируем строку в base64
    const commandBase64 = btoa(command);
    await device.writeCharacteristicWithResponseForService(
      SERVICE_UUID,
      COMMAND_CHAR_UUID,
      commandBase64
    );
  } catch (error) {
    console.error('Ошибка отправки команды:', error);
    throw error;
  }
};