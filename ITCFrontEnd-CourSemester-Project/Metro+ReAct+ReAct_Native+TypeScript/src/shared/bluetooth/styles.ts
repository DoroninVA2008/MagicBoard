import { StyleSheet } from 'react-native'
import { COLORS } from '@/shared/constant'

export const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: COLORS.HOME_BACKGROUND_SUN },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 16, color: COLORS.TEXT },
  item: { padding: 14, backgroundColor: '#fff', borderRadius: 12, marginBottom: 10 },
  itemText: { fontSize: 14, fontWeight: '600', color: COLORS.BLACK_TEXT },
  itemSub: { fontSize: 11, color: '#666' },
  button: { padding: 14, backgroundColor: COLORS.BACKGROUND_ACCENT, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  buttonText: { fontWeight: '700', color: COLORS.BUTTON_TEXT },
  close: { padding: 14, alignItems: 'center' },
  closeText: { color: COLORS.TEXT },
});