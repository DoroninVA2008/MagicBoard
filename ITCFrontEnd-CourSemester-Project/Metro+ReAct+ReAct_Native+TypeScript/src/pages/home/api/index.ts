import axios from 'axios'
import { API_CONFIG } from '/api.config'

const API = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
})

export const getData = async () => {
  try {
    const response = await API.get(API_CONFIG.ENDPOINTS.TALES)
    return response.data
  } catch (error) {
    console.error('Ошибка загрузки данных:', error)
    return []
  }
}