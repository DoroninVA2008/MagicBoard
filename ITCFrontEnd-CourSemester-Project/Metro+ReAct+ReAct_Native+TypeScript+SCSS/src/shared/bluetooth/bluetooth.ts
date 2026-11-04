// src/shared/bluetooth/bluetooth.ts
import { BleManager, Device, Subscription } from 'react-native-ble-plx'
import { PermissionsAndroid, Platform } from 'react-native'

// UUID твоей доски (замени на реальные из документации)
const SERVICE_UUID = '0000XXXX-0000-1000-8000-00805F9B34FB';
const COMMAND_CHAR_UUID = '0000YYYY-0000-1000-8000-00805F9B34FB';

// Стандартные UUID для батареи
const BATTERY_SERVICE_UUID = '180F';
const BATTERY_CHAR_UUID = '2A19';

// Один менеджер на всё приложение — обязательно singleton
export const bleManager = new BleManager();

// ---------------------------------------------------------------------------
// Разрешения
// ---------------------------------------------------------------------------
export const requestBlePermissions = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') return true;

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
  }
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );
  return granted === 'granted';
};

// ---------------------------------------------------------------------------
// Проверка адаптера
// ---------------------------------------------------------------------------
export const isBluetoothEnabled = async (): Promise<boolean> => {
  if (Platform.OS === 'web') return false;
  const state = await bleManager.state();
  return state === 'PoweredOn';
};

// ---------------------------------------------------------------------------
// Сканирование
// ---------------------------------------------------------------------------
export type ScanHandle = { stop: () => void };

export const scanForBoard = (
  onDeviceFound: (device: Device) => void,
  onError: (error: Error) => void,
  options?: { namePrefix?: string; timeoutMs?: number },
): ScanHandle => {
  const namePrefix = options?.namePrefix ?? 'MagicBoard';
  const timeoutMs = options?.timeoutMs ?? 15000;

  let stopped = false;
  const stop = () => {
    if (stopped) return;
    stopped = true;
    bleManager.stopDeviceScan();
  };

  const timer = setTimeout(stop, timeoutMs);

  bleManager.startDeviceScan(null, null, (error, device) => {
    if (stopped) return;
    if (error) {
      onError(error);
      stop();
      return;
    }
    const name = device?.name ?? device?.localName ?? '';
    if (name.startsWith(namePrefix)) {
      stop();
      onDeviceFound(device!);
    }
  });

  return {
    stop: () => {
      clearTimeout(timer);
      stop();
    },
  };
};

// ---------------------------------------------------------------------------
// Подключение + подписка на обрыв
// ---------------------------------------------------------------------------
export const connectToBoard = async (
  deviceId: string,
  onDisconnected?: (error: Error | null, device: Device | null) => void,
): Promise<Device> => {
  const device = await bleManager.connectToDevice(deviceId, { timeout: 10000 });
  await device.discoverAllServicesAndCharacteristics();

  if (onDisconnected) {
    // Аналог того, что давал ConnectionManager в форке
    device.onDisconnected(onDisconnected);
  }

  return device;
};

// ---------------------------------------------------------------------------
// Батарея
// ---------------------------------------------------------------------------
export const readBatteryLevel = async (device: Device): Promise<number | null> => {
  try {
    const characteristic = await device.readCharacteristicForService(
      BATTERY_SERVICE_UUID,
      BATTERY_CHAR_UUID,
    );
    if (characteristic.value) {
      const level = parseInt(atob(characteristic.value), 10);
      return Number.isFinite(level) ? level : null;
    }
  } catch (error) {
    console.warn('Ошибка чтения заряда:', error);
  }
  return null;
};

export const monitorBatteryLevel = (
  device: Device,
  onLevel: (level: number) => void,
  onError?: (error: Error) => void,
): Subscription =>
  device.monitorCharacteristicForService(
    BATTERY_SERVICE_UUID,
    BATTERY_CHAR_UUID,
    (error, characteristic) => {
      if (error) {
        onError?.(error);
        return;
      }
      if (characteristic?.value) {
        const level = parseInt(atob(characteristic.value), 10);
        if (Number.isFinite(level)) onLevel(level);
      }
    },
  );

// ---------------------------------------------------------------------------
// Команды
// ---------------------------------------------------------------------------
export const sendCommand = async (device: Device, command: string): Promise<void> => {
  if (Platform.OS === 'web') {
    throw new Error('Bluetooth недоступен в web');
  }
  try {
    const commandBase64 = btoa(command);
    await device.writeCharacteristicWithResponseForService(
      SERVICE_UUID,
      COMMAND_CHAR_UUID,
      commandBase64,
    );
  } catch (error) {
    console.error('Ошибка отправки команды:', error);
    throw error;
  }
};

// ---------------------------------------------------------------------------
// Отключение
// ---------------------------------------------------------------------------
export const disconnectBoard = async (device: Device): Promise<void> => {
  try {
    await device.cancelConnection();
  } catch {
    /* уже отключено */
  }
};