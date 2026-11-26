import { useEffect, useCallback } from 'react'
import { AppState } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { takeLatest, call } from 'redux-saga/effects'
import { bleService } from '@/entities/board/ble'
import type { AppDispatch } from '@/app/store'
import { BLE_SEND_COMMAND, BLE_SEEK, BleCommand } from '@/features/ble/types'
import { patchBoardState } from '@/features/ble/slices'
import { selectBleState } from '@/features/ble/selectors'

export const useBle = () => {
  const state = useSelector(selectBleState)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const unsub = bleService.subscribe((patch) => {
      dispatch(patchBoardState(patch))
    })
    const sub = AppState.addEventListener('change', (a) => {
      if (a === 'active') bleService.onAppResume()
    })
    return () => {
      unsub()
      sub.remove()
    }
  }, [dispatch])

  const sendCommand = useCallback(
    (cmd: BleCommand) => {
      dispatch(bleSendCommand(cmd))
    },
    [dispatch],
  )

  const seek = useCallback(
    (ms: number) => {
      dispatch(bleSeek(ms))
    },
    [dispatch],
  )

  return { ...state, sendCommand, seek }
}

export const bleSendCommand = (cmd: BleCommand) => ({
  type: BLE_SEND_COMMAND,
  payload: cmd,
})

export const bleSeek = (ms: number) => ({
  type: BLE_SEEK,
  payload: ms,
})

function* handleSendCommand(action: { payload: BleCommand }): Generator {
  yield call(bleService.send, action.payload)
}

function* handleSeek(action: { payload: number }): Generator {
  yield call(bleService.seek, action.payload)
}

export function* bleSaga() {
  yield takeLatest(BLE_SEND_COMMAND, handleSendCommand)
  yield takeLatest(BLE_SEEK, handleSeek)
}