import { configureStore } from '@reduxjs/toolkit'
import { useEffect, useState, useCallback } from 'react'
import { AppState } from 'react-native'
import { bleService } from '@/shared/bluetooth/ble'
import { BoardState } from '@/shared/bluetooth/types'
import { rootReducer } from './slice'

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export type SliceName = keyof typeof SLICES;

export const useBle = () => {
  const [state, setState] = useState<BoardState>({
    status: 'idle',
    battery: null,
    progress: 0,
    duration: 0,
    isPlaying: false,
  });

  useEffect(() => {
    const unsub = bleService.subscribe((patch) =>
      setState((prev) => ({ ...prev, ...patch })),
    );
    const sub = AppState.addEventListener('change', (a) => {
      if (a === 'active') bleService.onAppResume();
    });
    return () => { unsub(); sub.remove(); };
  }, []);

  const sendCommand = useCallback((cmd: string) => {
    if (cmd === 'START' || cmd === 'PAUSE') bleService.send(cmd);
  }, []);

  const seek = useCallback((ms: number) => bleService.seek(ms), []);

  return { ...state, sendCommand, seek };
};