import { all, fork } from 'redux-saga/effects'
import { bleSaga } from '@/features/ble'

export function* rootSaga() {
  yield all([fork(bleSaga)])
}