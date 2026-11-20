import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setTales, type RootState, type AppDispatch } from '@/app/store'
import { TALES_RESPONSE } from '../../../../mocks/db.ts' // /mocks/db.ts

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