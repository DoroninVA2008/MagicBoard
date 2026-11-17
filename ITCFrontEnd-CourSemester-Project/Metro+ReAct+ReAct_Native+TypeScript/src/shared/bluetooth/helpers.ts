import { Platform } from 'react-native'
import type { BleManager as BleManagerType } from 'react-native-ble-plx'
import type { BoardState } from '@/entities/board/types'

let BleManagerCtor: (new () => BleManagerType) | null = null;
let managerInstance: BleManagerType | null = null;

if (Platform.OS !== 'web') {// eslint-disable-next-line @typescript-eslint/no-var-requires
  BleManagerCtor = require('react-native-ble-plx').BleManager;
}

export function getManager(): BleManagerType {
  if (Platform.OS === 'web') {
    throw new Error('Bluetooth недоступен в web. Запускайте на Android.');
  }
  if (!managerInstance) {
    if (!BleManagerCtor) throw new Error('BleManager not available');
    managerInstance = new BleManagerCtor();
  }
  return managerInstance;
}

export function parseStatusPayload(s: string): Partial<BoardState> | null {
  const m = s.match(/(PLAY|PAUSE):(\d+)\/(\d+)/);
  if (m) {
    return {
      isPlaying: m[1] === 'PLAY',
      progress: +m[2],
      duration: +m[3],
    };
  }
  return null;
}

export function decodeBase64(value: string): string {
  try {
    return atob(value);
  } catch (e) {
    console.warn('Ошибка декодирования Base64:', e);
    return '';
  }
}

export function encodeBase64(value: string): string {
  try {
    return btoa(value);
  } catch (e) {
    console.warn('Ошибка кодирования Base64:', e);
    return '';
  }
}