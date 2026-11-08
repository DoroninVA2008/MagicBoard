// src/entities/music-slider/MusicSlider.tsx
import React, { useRef, useEffect, useState } from 'react'
import { View, StyleSheet, Animated, PanResponder, GestureResponderEvent } from 'react-native'
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio'

const audioSource = require('@/shared/audios/AllMagicTale.m4a')

interface MusicSliderProps {
  isActive: boolean;
  onProgressChange?: (ms: number) => void;
  onDurationChange?: (ms: number) => void;
}

const SLIDER_WIDTH = 300;
const THUMB_SIZE = 20;

export const MusicSlider: React.FC<MusicSliderProps> = ({
  isActive,
  onProgressChange,
  onDurationChange,
}) => {
  const player = useAudioPlayer(audioSource)
  const status = useAudioPlayerStatus(player)

  const animatedValue = useRef(new Animated.Value(0)).current
  const isDragging = useRef(false)
  const [isSeeking, setIsSeeking] = useState(false)

  const durationMs = status.duration > 0 ? status.duration * 1000 : 10000

  useEffect(() => {
    if (status.duration > 0) {
      onDurationChange?.(status.duration * 1000)
    }
  }, [status.duration, onDurationChange])

  useEffect(() => {
    if (isActive) {
      player.play()
    } else {
      player.pause()
    }
  }, [isActive, player])

  // Синхронизация
  useEffect(() => {
    if (isDragging.current) return

    if (status.duration > 0) {
      const realRatio = status.currentTime / status.duration

      // Если мы только что отпустили ползунок
      if (isSeeking) {
        // Ждем, пока аудио реально догонит то место, куда мы его бросили (разница < 1 сек)
        // Чтобы избежать ложных срабатываний, проверяем, что реальное время не 0
        if (status.currentTime > 0 && Math.abs(realRatio - (animatedValue as any).__getValue()) < 0.05) {
          setIsSeeking(false)
        }
        return // Блокируем визуальное обновление
      }

      // Обычная синхронизация
      animatedValue.setValue(realRatio)
      onProgressChange?.(status.currentTime * 1000)
    }
  }, [status.currentTime, status.duration, isSeeking, onProgressChange, animatedValue])

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        isDragging.current = true
      },
      onPanResponderMove: (evt: GestureResponderEvent) => {
        const x = evt.nativeEvent.locationX
        const ratio = Math.max(0, Math.min(1, x / SLIDER_WIDTH))
        animatedValue.setValue(ratio)
      },
      onPanResponderRelease: (evt) => {
        const x = evt.nativeEvent.locationX
        let ratio = Math.max(0, Math.min(1, x / SLIDER_WIDTH))
        if (ratio > 0.99) ratio = 0.99

        isDragging.current = false

        if (status.duration && status.duration > 0) {
          const newTime = ratio * status.duration
          if (Number.isFinite(newTime)) {
            setIsSeeking(true) // Блокируем авто-синхронизацию
            player.seekTo(newTime)
            onProgressChange?.(newTime * 1000)
          }
        }
      },
            onPanResponderTerminate: (evt) => {
        // Тот же код, что и в onPanResponderRelease
        const x = evt.nativeEvent.locationX
        let ratio = Math.max(0, Math.min(1, x / SLIDER_WIDTH))
        if (ratio > 0.99) ratio = 0.99
        isDragging.current = false
        if (status.duration && status.duration > 0) {
          const newTime = ratio * status.duration
          if (Number.isFinite(newTime)) {
            setIsSeeking(true)
            player.seekTo(newTime)
            onProgressChange?.(newTime * 1000)
          }
        }
      },
    }),
  ).current

  const thumbPosition = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SLIDER_WIDTH - THUMB_SIZE],
  })

  return (
    <View style={styles.container}>
      <View style={styles.sliderTrack} {...panResponder.panHandlers}>
        <Animated.View
          style={[
            styles.progressBar,
            { width: animatedValue.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) },
          ]}
        />
        <Animated.View style={[styles.thumb, { transform: [{ translateX: thumbPosition }] }]} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { justifyContent: 'center', alignItems: 'center', paddingVertical: 20 },
  sliderTrack: { width: SLIDER_WIDTH, height: 9, backgroundColor: '#7A7A7A', borderRadius: 20, justifyContent: 'center', paddingHorizontal: 10, position: 'relative' },
  progressBar: { height: 9, backgroundColor: '#F4FAFF', borderRadius: 20, position: 'absolute', left: 0, top: '50%', marginTop: -5 },
  thumb: { width: 20, height: 20, backgroundColor: '#181818', borderRadius: 10, position: 'absolute', top: '50%', marginTop: -10 },
})