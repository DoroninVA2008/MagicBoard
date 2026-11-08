import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setTales, type RootState, type AppDispatch } from '@/shared/store'
import { TALES_RESPONSE } from '@/shared/datas/db'

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