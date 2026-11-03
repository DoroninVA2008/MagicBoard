import { Platform } from 'react-native'
import { BleManager, type Device, Subscription } from 'react-native-ble-plx'
import { BLE_UUIDS, BoardState } from './types'

let BleManager: any = null;
let managerInstance: any = null;

if (Platform.OS !== 'web') {
  BleManager = require('react-native-ble-plx').BleManager;
}

class BleService {
  private manager = new BleManager();
  private device: Device | null = null;
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private listeners = new Set<(s: Partial<BoardState>) => void>();

  // getManager() { return this.manager; }
  
  getManager() {
    if (Platform.OS === 'web') {
      throw new Error('Bluetooth недоступен в web');
    }
    if (!managerInstance) managerInstance = new BleManager();
    return managerInstance;
  }

  subscribe(cb: (s: Partial<BoardState>) => void) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }
  private emit(s: Partial<BoardState>) {
    this.listeners.forEach(l => l(s));
  }

  async connectById(id: string) {
    this.emit({ status: 'connecting' });
    try {
      const dev = await this.manager.connectToDevice(id, { timeout: 10000 });
      this.device = dev;
      await dev.discoverAllServicesAndCharacteristics();
      await this.setupNotifications(dev);
      this.emit({ status: 'connected', deviceName: dev.name ?? undefined });
      this.reconnectAttempts = 0;
      this.setupDisconnectHandler(dev);
    } catch (e) {
      this.emit({ status: 'error' });
      this.scheduleReconnect();
    }
  }

  private setupDisconnectHandler(dev: Device) {
    dev.onDisconnected(() => {
      this.emit({ status: 'disconnected' });
      this.scheduleReconnect();
    });
  }

  private async setupNotifications(dev: Device) {
    // battery
    dev.monitorCharacteristicForService(
      BLE_UUIDS.SERVICE, BLE_UUIDS.BATTERY_CHAR,
      (_e, ch) => {
        if (ch?.value) {
          const v = parseInt(atob(ch.value), 10);
          if (!Number.isNaN(v)) this.emit({ battery: v });
        }
      }
    );
    // status
    dev.monitorCharacteristicForService(
      BLE_UUIDS.SERVICE, BLE_UUIDS.STATUS_CHAR,
      (_e, ch) => {
        const s = ch?.value ? atob(ch.value) : '';
        // формат зависит от прошивки, например "PLAY:12345/60000"
        this.parseStatus(s);
      }
    );
  }

  private parseStatus(s: string) {
    // адаптируйте под протокол
    const m = s.match(/(PLAY|PAUSE):(\d+)\/(\d+)/);
    if (m) {
      this.emit({
        isPlaying: m[1] === 'PLAY',
        progress: +m[2],
        duration: +m[3],
      });
    }
  }

  async send(cmd: 'START' | 'PAUSE') {
    if (!this.device) return;
    const payload = btoa(cmd);
    await this.device.writeCharacteristicWithResponseForService(
      BLE_UUIDS.SERVICE, BLE_UUIDS.COMMAND_CHAR, payload,
    );
  }

  async seek(ms: number) {
    if (!this.device) return;
    await this.device.writeCharacteristicWithResponseForService(
      BLE_UUIDS.SERVICE, BLE_UUIDS.COMMAND_CHAR, btoa(`SEEK:${ms}`),
    );
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return;
    const delay = Math.min(2000 * 2 ** this.reconnectAttempts, 30000);
    this.reconnectAttempts += 1;
    this.reconnectTimer = setTimeout(async () => {
      this.reconnectTimer = null;
      if (!this.device) return;
      try {
        await this.device.connect();
        await this.device.discoverAllServicesAndCharacteristics();
        await this.setupNotifications(this.device);
        this.emit({ status: 'connected' });
        this.reconnectAttempts = 0;
      } catch {
        this.scheduleReconnect();
      }
    }, delay);
  }
}

export const bleService = new BleService();