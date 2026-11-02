import { useEffect, useState } from 'react'
import { getData } from '../api'

interface taleList {
  imageUrl: string, 
  name: string, 
  author: string,
  forName: string,
  linkAll: string,
}

export const useTale = () => {
    const [list, setList] = useState<taleList[]>([])

    useEffect(() => {
        getData()
        .then((respons) => {
            // ГЛАВНОЕ ИСПРАВЛЕНИЕ: проверяем, что пришел именно массив
            if (Array.isArray(respons)) {
                setList(respons)
            } else {
                console.error("Ожидался массив, но пришло:", respons)
                setList([]) // Оставляем пустой массив, чтобы не было падения
            }
        })
        .catch((error) => {
            // Если запрос упал (например, из-за CORS), не роняем приложение
            console.error("Ошибка при загрузке данных:", error)
            setList([])
        })
    }, []);

    // Безопасное получение данных
    const dataSheet = list.length > 0 ? (list[0]?.forName || "Сказки") : "Загрузка..."
    const dataTale = list.length > 0 ? list.slice(1) : []

    return { dataSheet, dataTale }
}