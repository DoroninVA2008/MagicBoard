import { useEffect, useCallback } from 'react'
import { AppState } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import type { RootState, AppDispatch, SliceName } from '@/app/store/types'
import { selectBleState } from '@/app/store/selectors'
import { patchBoardState, rootReducer, setTales, slices } from '@/app/store/slices'
import { rootSaga, bleSendCommand, bleSeek } from '@/app/store/sagas'
import { bleService } from '@/entities/board/ble'
import { TALES_RESPONSE } from '../../../mocks/db.ts' // /mocks/db.ts

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

export const useTale = () => {
  const { dataSheet, dataTale, loading, error } = useSelector(
    (s: RootState) => s.tales,
  )
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(
      setTales({
        dataSheet: TALES_RESPONSE.header.forName,
        dataTale: TALES_RESPONSE.tales,
      }),
    )
  }, [dispatch])

  return { dataSheet, dataTale, loading, error }
}