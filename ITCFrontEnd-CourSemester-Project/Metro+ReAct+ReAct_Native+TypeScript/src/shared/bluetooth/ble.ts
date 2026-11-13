import { Platform } from 'react-native'
import type { Device, Subscription } from 'react-native-ble-plx'
import { BLE_UUIDS, BoardState } from '@/shared/bluetooth/types'
import { getManager, parseStatusPayload } from '@/shared/bluetooth/helpers'

class BleService {
  private device: Device | null = null;
  private deviceId: string | null = null;
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private listeners = new Set<(s: Partial<BoardState>) => void>();
  private disconnectSub: Subscription | null = null;
  private notifySubs: Subscription[] = [];

  subscribe(cb: (s: Partial<BoardState>) => void) {
    this.listeners.add(cb);
    return () => { this.listeners.delete(cb); };
  }

  private emit(s: Partial<BoardState>) {
    this.listeners.forEach((l) => l(s));
  }

  async connectById(id: string) {
    this.deviceId = id;
    this.emit({ status: 'connecting' });
    try {
      await this.attachToDevice(id);
      this.emit({ status: 'connected', deviceName: this.device?.name ?? undefined });
      this.reconnectAttempts = 0;
    } catch (e) {
      console.warn('connectById failed', e);
      this.emit({ status: 'error' });
      this.scheduleReconnect();
    }
  }

  private async attachToDevice(id: string) {
    const manager = getManager();
    const dev = await manager.connectToDevice(id, { timeout: 10000 });
    await dev.discoverAllServicesAndCharacteristics();
    this.device = dev;
    await this.setupNotifications(dev);
    this.setupDisconnectHandler(dev);
  }

  private setupDisconnectHandler(dev: Device) {
    this.disconnectSub?.remove();
    this.disconnectSub = dev.onDisconnected(() => {
      this.emit({ status: 'disconnected' });
      this.device = null;
      this.clearNotifySubs();
      this.scheduleReconnect();
    });
  }

  private clearNotifySubs() {
    this.notifySubs.forEach((s) => s.remove());
    this.notifySubs = [];
  }

  private async setupNotifications(dev: Device) {
    this.clearNotifySubs();

    try {
      const batterySub = dev.monitorCharacteristicForService(
        BLE_UUIDS.SERVICE,
        BLE_UUIDS.BATTERY_CHAR,
        (_e, ch) => {
          if (ch?.value) {
            const v = parseInt(atob(ch.value), 10);
            if (!Number.isNaN(v)) this.emit({ battery: v });
          }
        },
      );
      this.notifySubs.push(batterySub);
    } catch (e) {
      console.warn('battery monitor failed', e);
    }

    try {
      const statusSub = dev.monitorCharacteristicForService(
        BLE_UUIDS.SERVICE,
        BLE_UUIDS.STATUS_CHAR,
        (_e, ch) => {
          if (!ch?.value) return;
          const s = atob(ch.value);
          const parsed = parseStatusPayload(s);
          if (parsed) this.emit(parsed);
        },
      );
      this.notifySubs.push(statusSub);
    } catch (e) {
      console.warn('status monitor failed', e);
    }
  }

  async send(cmd: 'START' | 'PAUSE') {
    if (!this.device || !this.device.id) {
      console.log('[BLE] send skipped (no device):', cmd);
      return;
    }
    try {
      await this.device.writeCharacteristicWithResponseForService(
        BLE_UUIDS.SERVICE,
        BLE_UUIDS.COMMAND_CHAR,
        btoa(cmd),
      );
    } catch (error) {
      console.warn('[BLE] Ошибка отправки команды:', error);
    }
  }

  async seek(ms: number) {
    if (!this.device || !this.device.id) {
      console.log('[BLE] seek skipped (no device):', ms);
      return;
    }
    try {
      await this.device.writeCharacteristicWithResponseForService(
        BLE_UUIDS.SERVICE,
        BLE_UUIDS.COMMAND_CHAR,
        btoa(`SEEK:${ms}`),
      );
    } catch (error) {
      console.warn('[BLE] Ошибка перемотки:', error);
    }
  }

  async disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.disconnectSub?.remove();
    this.disconnectSub = null;
    this.clearNotifySubs();
    if (this.device) {
      try { await this.device.cancelConnection(); } catch {

      }
    }
    this.device = null;
    this.emit({ status: 'idle' });
  }

  onAppResume() {
    if (!this.device || !this.deviceId) return;
    this.device.isConnected()
      .then((ok: boolean) => { if (!ok) this.scheduleReconnect(); })
      .catch(() => this.scheduleReconnect());
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return;
    if (!this.deviceId) return;
    if (Platform.OS === 'web') return;
    const delay = Math.min(2000 * 2 ** this.reconnectAttempts, 30000);
    this.reconnectAttempts += 1;
    this.reconnectTimer = setTimeout(async () => {
      this.reconnectTimer = null;
      try {
        await this.attachToDevice(this.deviceId!);
        this.emit({ status: 'connected' });
        this.reconnectAttempts = 0;
      } catch {
        this.scheduleReconnect();
      }
    }, delay);
  }
}

export const bleService = new BleService();