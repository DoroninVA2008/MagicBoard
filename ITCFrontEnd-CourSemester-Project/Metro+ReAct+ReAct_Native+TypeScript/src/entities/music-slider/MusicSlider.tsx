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
  
  // Здесь храним время, куда перемотали
  const seekTargetRef = useRef<number | null>(null)
  const [isSeeking, setIsSeeking] = useState(false)
  
  // Этот таймер не даст ползунку дернуться, если браузер завис
  const seekTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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
      // Если мы перематываем — ждем, пока аудио догонит
      if (seekTargetRef.current !== null) {
        // На вебе браузер может сбросить currentTime в 0 на время буферизации.
        // Ждем, пока разница станет минимальной (или пройдет 1.5 секунды)
        const diff = Math.abs(status.currentTime - seekTargetRef.current)
        
        if (diff < 0.5) {
          seekTargetRef.current = null
          setIsSeeking(false)
          if (seekTimeoutRef.current) clearTimeout(seekTimeoutRef.current)
        } else {
          return // Пока не догнал — ничего не трогаем
        }
      }

      const realRatio = status.currentTime / status.duration
      animatedValue.setValue(realRatio)
      onProgressChange?.(status.currentTime * 1000)
    }
  }, [status.currentTime, status.duration, onProgressChange, animatedValue])

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        isDragging.current = true
        seekTargetRef.current = null
        if (seekTimeoutRef.current) clearTimeout(seekTimeoutRef.current)
      },
      onPanResponderMove: (evt: GestureResponderEvent) => {
        const x = evt.nativeEvent.locationX
        const ratio = Math.max(0, Math.min(1, x / SLIDER_WIDTH))
        animatedValue.setValue(ratio)
      },
      onPanResponderRelease: (evt) => {
        handleSeek(evt.nativeEvent.locationX)
      },
      onPanResponderTerminate: (evt) => {
        handleSeek(evt.nativeEvent.locationX)
      },
    }),
  ).current

  const handleSeek = (locationX: number) => {
    let ratio = Math.max(0, Math.min(1, locationX / SLIDER_WIDTH))
    if (ratio > 0.99) ratio = 0.99

    isDragging.current = false

    if (status.duration && status.duration > 0) {
      const newTime = ratio * status.duration
      if (Number.isFinite(newTime)) {
        animatedValue.setValue(ratio)
        seekTargetRef.current = newTime
        setIsSeeking(true)
        
        player.seekTo(newTime)
        onProgressChange?.(newTime * 1000)

        // Страховка: если браузер не обновит currentTime корректно, 
        // принудительно снимем блокировку через 1.5 секунды, 
        // чтобы ползунок не застыл навсегда.
        if (seekTimeoutRef.current) clearTimeout(seekTimeoutRef.current)
        seekTimeoutRef.current = setTimeout(() => {
          seekTargetRef.current = null
          setIsSeeking(false)
        }, 1500)
      }
    }
  }

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