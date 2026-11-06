import { useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { AppState } from 'react-native'
import { bleService } from '@/shared/bluetooth/ble'
import { patchBoardState, type RootState, type AppDispatch } from '@/app/slice'

export const useBle = () => {
  const state = useSelector((s: RootState) => s.ble);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const unsub = bleService.subscribe((patch) => {
      dispatch(patchBoardState(patch));
    });
    const sub = AppState.addEventListener('change', (a) => {
      if (a === 'active') bleService.onAppResume();
    });
    return () => { unsub(); sub.remove(); };
  }, [dispatch]);

  const sendCommand = useCallback((cmd: string) => {
    if (cmd === 'START' || cmd === 'PAUSE') bleService.send(cmd);
  }, []);

  const seek = useCallback((ms: number) => bleService.seek(ms), []);

  return { ...state, sendCommand, seek };
};