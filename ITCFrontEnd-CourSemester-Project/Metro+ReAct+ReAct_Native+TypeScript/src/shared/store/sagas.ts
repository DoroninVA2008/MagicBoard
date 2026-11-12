import { takeLatest, call, put } from 'redux-saga/effects'
import { bleService } from '@/shared/bluetooth/ble'
import { setStatus } from '@/shared/store/slice'

export const BLE_SEND_COMMAND = 'BLE_SEND_COMMAND'
export const BLE_SEEK = 'BLE_SEEK'

export const bleSendCommand = (cmd: 'START' | 'PAUSE') => ({ type: BLE_SEND_COMMAND, payload: cmd })
export const bleSeek = (ms: number) => ({ type: BLE_SEEK, payload: ms })

function* handleSendCommand(action: any): Generator {
  try {
    yield call(bleService.send, action.payload)
  } catch (error) {
    console.log('Saga: send ignored (no device)')
  }
}

function* handleSeek(action: any): Generator {
  try {
    yield call(bleService.seek, action.payload)
  } catch (error) {
    console.log('Saga: seek ignored (no device)')
  }
}

export function* rootSaga() {
  yield takeLatest(BLE_SEND_COMMAND, handleSendCommand)
  yield takeLatest(BLE_SEEK, handleSeek)
}