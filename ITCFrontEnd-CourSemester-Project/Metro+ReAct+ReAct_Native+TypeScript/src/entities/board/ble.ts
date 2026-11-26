import { Platform } from 'react-native'
import type { Device, Subscription } from 'react-native-ble-plx'
import { BLE_UUIDS, BoardState } from '@/entities/board/types'
import { getManager, parseStatusPayload, decodeBase64, encodeBase64 } from '@/shared/bluetooth/helpers'

export function BleService() {
  let device: Device | null = null;
  let deviceId: string | null = null;
  let reconnectAttempts = 0;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  const listeners = new Set<(s: Partial<BoardState>) => void>();
  let disconnectSub: Subscription | null = null;
  let notifySubs: Subscription[] = [];

  const emit = (s: Partial<BoardState>) => {
    listeners.forEach((l) => l(s));
  };

  const clearNotifySubs = () => {
    notifySubs.forEach((s) => s.remove());
    notifySubs = [];
  };

  const setupNotifications = async (dev: Device) => {
    clearNotifySubs();

    try {
      const batterySub = dev.monitorCharacteristicForService(
        BLE_UUIDS.SERVICE,
        BLE_UUIDS.BATTERY_CHAR,
        (_e, ch) => {
          if (ch?.value) {
            const v = parseInt(decodeBase64(ch.value), 10);
            if (!Number.isNaN(v)) emit({ battery: v });
          }
        },
      );
      notifySubs.push(batterySub);
    } catch (e) {
      console.warn('battery monitor failed', e);
    }

    try {
      const statusSub = dev.monitorCharacteristicForService(
        BLE_UUIDS.SERVICE,
        BLE_UUIDS.STATUS_CHAR,
        (_e, ch) => {
          if (!ch?.value) return;
          const s = decodeBase64(ch.value);
          const parsed = parseStatusPayload(s);
          if (parsed) emit(parsed);
        },
      );
      notifySubs.push(statusSub);
    } catch (e) {
      console.warn('status monitor failed', e);
    }
  };

  const setupDisconnectHandler = (dev: Device) => {
    disconnectSub?.remove();
    disconnectSub = dev.onDisconnected(() => {
      emit({ status: 'disconnected' });
      device = null;
      clearNotifySubs();
      scheduleReconnect();
    });
  };

  const attachToDevice = async (id: string) => {
    const manager = getManager();
    const dev = await manager.connectToDevice(id, { timeout: 10000 });
    await dev.discoverAllServicesAndCharacteristics();
    device = dev;
    await setupNotifications(dev);
    setupDisconnectHandler(dev);
  };

  const scheduleReconnect = () => {
    if (reconnectTimer) return;
    if (!deviceId) return;
    if (Platform.OS === 'web') return;

    const delay = Math.min(2000 * 2 ** reconnectAttempts, 30000);
    reconnectAttempts += 1;

    reconnectTimer = setTimeout(async () => {
      reconnectTimer = null;
      try {
        await attachToDevice(deviceId!);
        emit({ status: 'connected' });
        reconnectAttempts = 0;
      } catch {
        scheduleReconnect();
      }
    }, delay);
  };

  const subscribe = (cb: (s: Partial<BoardState>) => void) => {
    listeners.add(cb);
    return () => {
      listeners.delete(cb);
    };
  };

  const connectById = async (id: string) => {
    deviceId = id;
    emit({ status: 'connecting' });
    try {
      await attachToDevice(id);
      emit({ status: 'connected', deviceName: device?.name ?? undefined });
      reconnectAttempts = 0;
    } catch (e) {
      console.warn('connectById failed', e);
      emit({ status: 'error' });
      scheduleReconnect();
    }
  };

  const send = async (cmd: 'START' | 'PAUSE') => {
    if (!device || !device.id) {
      console.log('[BLE] send skipped (no device):', cmd);
      return;
    }
    try {
      await device.writeCharacteristicWithResponseForService(
        BLE_UUIDS.SERVICE,
        BLE_UUIDS.COMMAND_CHAR,
        encodeBase64(cmd),
      );
    } catch (error) {
      console.warn('[BLE] Ошибка отправки команды:', error);
    }
  };

  const seek = async (ms: number) => {
    if (!device || !device.id) {
      console.log('[BLE] seek skipped (no device):', ms);
      return;
    }
    try {
      await device.writeCharacteristicWithResponseForService(
        BLE_UUIDS.SERVICE,
        BLE_UUIDS.COMMAND_CHAR,
        encodeBase64(`SEEK:${ms}`),
      );
    } catch (error) {
      console.warn('[BLE] Ошибка перемотки:', error);
    }
  };

  const disconnect = async () => {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    disconnectSub?.remove();
    disconnectSub = null;
    clearNotifySubs();
    if (device) {
      try {
        await device.cancelConnection();
      } catch {
        /* noop */
      }
    }
    device = null;
    emit({ status: 'idle' });
  };

  const onAppResume = () => {
    if (!device || !deviceId) return;
    device
      .isConnected()
      .then((ok: boolean) => {
        if (!ok) scheduleReconnect();
      })
      .catch(() => scheduleReconnect());
  };

  return {
    subscribe,
    connectById,
    send,
    seek,
    disconnect,
    onAppResume,
  };
}

export const bleService = BleService();