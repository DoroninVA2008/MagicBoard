// src/shared/store/sagas.ts
import { takeLatest, call, put } from 'redux-saga/effects'
import { bleService } from '@/shared/bluetooth/ble'
import { setStatus } from './slice' // <--- Берем из slice, а не из store!

export const BLE_SEND_COMMAND = 'BLE_SEND_COMMAND'
export const BLE_SEEK = 'BLE_SEEK'

export const bleSendCommand = (cmd: 'START' | 'PAUSE') => ({ type: BLE_SEND_COMMAND, payload: cmd })
export const bleSeek = (ms: number) => ({ type: BLE_SEEK, payload: ms })

function* handleSendCommand(action: any): Generator {
  try {
    const cmd = action.payload
    yield call(bleService.send, cmd)
  } catch (error) {
    console.error('Saga: Ошибка отправки команды', error)
    yield put(setStatus('error'))
  }
}

function* handleSeek(action: any): Generator {
  try {
    const ms = action.payload
    yield call(bleService.seek, ms)
  } catch (error) {
    console.error('Saga: Ошибка перемотки', error)
  }
}

export function* rootSaga() {
  yield takeLatest(BLE_SEND_COMMAND, handleSendCommand)
  yield takeLatest(BLE_SEEK, handleSeek)
}