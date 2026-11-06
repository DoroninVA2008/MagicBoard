import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getData } from '../api'
import type { RootState, AppDispatch } from '@/app/slice'
import { setTales, setLoading, setError } from '@/app/slice'

export const useTale = () => {
  const { dataSheet, dataTale, loading, error } = useSelector(
    (s: RootState) => s.tales,
  )
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(setLoading(true))
    getData()
      .then((response) => {
        if (Array.isArray(response)) {
          const header = response.find((item: any) => item.forName)
          const tales = response.filter((item: any) => item.id && item.imageUrl && item.name)

          dispatch(setTales({
            dataSheet: header?.forName ?? 'Сказки',
            dataTale: tales,
          }))
        } else {
          console.error("Ожидался массив, но пришло:", response)
          dispatch(setTales({ dataSheet: 'Сказки', dataTale: [] }))
        }
      })
      .catch((err) => {
        console.error("Ошибка при загрузке данных:", err)
        dispatch(setError(err?.message ?? 'Ошибка загрузки'))
      })
  }, [dispatch])

  return { dataSheet, dataTale, loading, error }
}