import { StyleSheet } from 'react-native'

export const SLIDER_WIDTH = 300;

export const styles = StyleSheet.create({
  container: { justifyContent: 'center', alignItems: 'center', paddingVertical: 20 },
  sliderTrack: { width: SLIDER_WIDTH, height: 40, justifyContent: 'center', position: 'relative' },
  trackBg: { height: 9, backgroundColor: '#7A7A7A', borderRadius: 20, position: 'absolute', left: 0, right: 0, top: '50%', marginTop: -4.5 },
  progressBar: { height: 9, backgroundColor: '#F4FAFF', borderRadius: 20, position: 'absolute', left: 0, top: '50%', marginTop: -4.5 },
  thumb: { width: 20, height: 20, backgroundColor: '#181818', borderRadius: 10, position: 'absolute', top: '50%', marginTop: -10 }
});