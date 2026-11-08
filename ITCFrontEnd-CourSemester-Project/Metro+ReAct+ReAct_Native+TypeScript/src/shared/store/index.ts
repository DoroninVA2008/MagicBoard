export {
  store,
  useBle,
  SLICES,
  patchBoardState,
  setStatus,
  setBattery,
  resetBoard,
  setTales,        // ← обязательно
  setLoading,
  setError,
} from './store'

export type {
  RootState,
  AppDispatch,
  SliceName,
  Tale,
} from './store'