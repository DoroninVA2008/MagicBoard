import { useEffect, useCallback } from 'react'
import { AppState } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import { rootSaga, bleSendCommand, bleSeek } from '@/shared/store/sagas'
import { patchBoardState, rootReducer, SLICES } from '@/shared/store/slice'
import { selectBleState } from '@/shared/store/selectors'
import { bleService } from '@/shared/bluetooth/ble'

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: false,
    }).concat(sagaMiddleware),
})

sagaMiddleware.run(rootSaga)

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
export type SliceName = keyof typeof SLICES

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

  const sendCommand = useCallback((cmd: string) => {
    if (cmd === 'START' || cmd === 'PAUSE') {
      dispatch(bleSendCommand(cmd))
    }
  }, [dispatch])

  const seek = useCallback((ms: number) => {
    dispatch(bleSeek(ms))
  }, [dispatch])

  return { ...state, sendCommand, seek }
}