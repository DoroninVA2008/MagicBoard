import { takeLatest, call, put } from 'redux-saga/effects'
import { bleService } from '@/shared/bluetooth/ble'
import { setStatus } from '@/shared/store/slice'

export const BLE_SEND_COMMAND = 'BLE_SEND_COMMAND'
export const BLE_SEEK = 'BLE_SEEK'

export const bleSendCommand = (cmd: 'START' | 'PAUSE') => ({ type: BLE_SEND_COMMAND, payload: cmd })
export const bleSeek = (ms: number) => ({ type: BLE_SEEK, payload: ms })

function* handleSendCommand(action: any): Generator {
  yield call(bleService.send, action.payload)
}

function* handleSeek(action: any): Generator {
  yield call(bleService.seek, action.payload)
}

export function* rootSaga() {
  yield takeLatest(BLE_SEND_COMMAND, handleSendCommand)
  yield takeLatest(BLE_SEEK, handleSeek)
}