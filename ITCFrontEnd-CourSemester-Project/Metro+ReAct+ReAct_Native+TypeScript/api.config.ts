import { Platform } from 'react-native'

const LOCAL_IP = '192.168.43.217'

export const API_CONFIG = {
  BASE_URL: Platform.select({
    android: `http://${LOCAL_IP}:8000`,
    ios: `http://${LOCAL_IP}:8000`,
    web: 'http://localhost:8000',
    default: 'http://localhost:8000',
  }),
  TIMEOUT: 10000,
  ENDPOINTS: {
    TALES: '/red-hood', // /tale
  }
}