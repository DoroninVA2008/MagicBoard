export const BLE_UUIDS = {
  SERVICE:        '0000xxxx-0000-1000-8000-00805f9b34fb',
  COMMAND_CHAR:   '0000yyyy-...',   // write: START/PAUSE/SEEK
  STATUS_CHAR:    '0000zzzz-...',   // notify: состояние
  BATTERY_CHAR:   '0000bbbb-...',   // notify/read: заряд %
  PROGRESS_CHAR:  '0000pppp-...',   // notify: текущий прогресс (ms)
} as const;

export type BleStatus = 'idle' | 'scanning' | 'connecting' | 'connected' | 'disconnected' | 'error';

export type BoardState = {
  status: BleStatus;
  battery: number | null;
  progress: number;     // ms
  duration: number;     // ms
  isPlaying: boolean;
  deviceName?: string;
};

export type Command = 'START' | 'PAUSE' | 'SEEK';