import { useState, useEffect, useCallback } from 'react'
import { Device } from '@sfourdrinier/react-native-ble-plx'
import { 
  bleManager, 
  requestBlePermissions, 
  scanForBoard, 
  readBatteryLevel, 
  sendCommand as sendBleCommand 
} from './bluetooth'

export const useBle = () => {
  const [device, setDevice] = useState<Device | null>(null);
  const [status, setStatus] = useState<string>('Поиск...');
  const [battery, setBattery] = useState<number | null>(null);

  // Инициализация и поиск
  useEffect(() => {
    const initBle = async () => {
      const hasPermissions = await requestBlePermissions();
      if (!hasPermissions) {
        setStatus('Нет разрешений');
        return;
      }

      const isPoweredOn = await bleManager.state();
      if (isPoweredOn !== 'PoweredOn') {
        setStatus('Включите Bluetooth');
        return;
      }

      scanForBoard(
        async (foundDevice) => {
          setStatus('Подключение...');
          try {
            const connected = await foundDevice.connect();
            await connected.discoverAllServicesAndCharacteristics();
            setDevice(connected);
            setStatus('Подключено');

            // Читаем заряд
            const level = await readBatteryLevel(connected);
            setBattery(level);

            // Обработка обрыва
            connected.onDisconnected(() => {
              setDevice(null);
              setStatus('Отключено');
              setBattery(null);
            });

          } catch (err) {
            setStatus('Ошибка подключения');
          }
        },
        () => setStatus('Ошибка поиска')
      );
    };

    initBle();

    // Очистка при размонтировании
    return () => {
      bleManager.stopDeviceScan();
      if (device) {
        device.cancelConnection();
      }
    };
  }, []);

  // Обертка для отправки команд
  const sendCommand = useCallback(async (command: string) => {
    if (device) {
      try {
        await sendBleCommand(device, command);
      } catch (e) {
        setStatus('Ошибка команды');
      }
    }
  }, [device]);

  return { status, battery, sendCommand };
};