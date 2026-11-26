import type { BoardState, BleStatus } from '@/entities/board'
export type { BoardState, BleStatus } from '@/entities/board'

export type BleCommand = 'START' | 'PAUSE'

export type BlePatch = Partial<BoardState>

export const BLE_SEND_COMMAND = 'ble/sendCommand' as const
export const BLE_SEEK = 'ble/seek' as const