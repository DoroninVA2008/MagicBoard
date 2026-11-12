import React, { useRef, useEffect, useState } from 'react'
import { View, Animated, PanResponder, GestureResponderEvent, PanResponderGestureState } from 'react-native'
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio'
import { styles } from '@/views/music-slider/styles'

const audioSource = require('@/shared/audios/AllMagicTale.m4a');

interface MusicSliderProps {
  taleId?: number;
  isActive: boolean;
  duration: number;
  initialProgress?: number;
  onProgressChange?: (ms: number) => void;
  onDurationChange?: (ms: number) => void;
}

const SLIDER_WIDTH = 300;
const THUMB_SIZE = 20;

export const MusicSlider: React.FC<MusicSliderProps> = ({
  taleId = 0,
  isActive,
  duration = 1000,
  initialProgress = 0,
  onProgressChange,
  onDurationChange,
}) => {
  const animatedValue = useRef(new Animated.Value(initialProgress)).current;
  const isDragging = useRef(false);
  const isSeeking = useRef(false);

  const progressRef = useRef(initialProgress);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [sliderPageX, setSliderPageX] = useState(0);

  const isActiveRef = useRef(isActive);
  useEffect(() => { isActiveRef.current = isActive }, [isActive]);

  // === ЛОГИКА АУДИО ===
  const player = useAudioPlayer(audioSource);
  const status = useAudioPlayerStatus(player);

  const hasAudio = taleId === 1;
  const actualDuration = hasAudio && status.duration > 0
    ? status.duration * 1000
    : duration;

  useEffect(() => {
    onDurationChange?.(actualDuration);
  }, [actualDuration, onDurationChange]);

  // Управление воспроизведением
  useEffect(() => {
    if (!hasAudio) return;
    if (isActive) {
      player.play();
    } else {
      player.pause();
    }
  }, [isActive, hasAudio, player]);

  // Синхронизация с аудио
  useEffect(() => {
    // Если мы тянем ползунок или ждем перемотки — не трогаем его
    if (!hasAudio || isDragging.current || isSeeking.current) return; 

    if (status.duration > 0) {
      const ratio = status.currentTime / status.duration;
      animatedValue.setValue(ratio);
      progressRef.current = ratio;
      onProgressChange?.(status.currentTime * 1000);
    }
  }, [status.currentTime, status.duration, hasAudio, onProgressChange, animatedValue]);

  // Таймер для треков БЕЗ аудио
  const startTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!isActiveRef.current || hasAudio) return;

    const startTime = Date.now() - progressRef.current * actualDuration;

    intervalRef.current = setInterval(() => {
      if (isDragging.current || !isActiveRef.current) return;

      const elapsed = Date.now() - startTime;
      const nextRatio = Math.min(1, elapsed / actualDuration);

      animatedValue.setValue(nextRatio);
      progressRef.current = nextRatio;
      onProgressChange?.(nextRatio * actualDuration);

      if (nextRatio >= 1 && intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }, 100);
  };

  useEffect(() => {
    if (isActive && !hasAudio) {
      startTimer();
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, actualDuration, hasAudio]);

  const seekAudio = (ms: number) => {
    if (hasAudio && status.duration > 0) {
      player.seekTo(ms / 1000);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      
      onPanResponderGrant: (evt: GestureResponderEvent) => {
        isDragging.current = true;
        isSeeking.current = true;
        if (intervalRef.current) clearInterval(intervalRef.current);

        const x = evt.nativeEvent.locationX;
        const ratio = Math.max(0, Math.min(1, x / SLIDER_WIDTH));
        
        animatedValue.setValue(ratio);
        progressRef.current = ratio;
      },
      
      onPanResponderMove: (_evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        const x = gestureState.moveX - sliderPageX;
        const ratio = Math.max(0, Math.min(1, x / SLIDER_WIDTH));
        
        animatedValue.setValue(ratio);
        progressRef.current = ratio;
      },
      
      onPanResponderRelease: (evt: GestureResponderEvent) => {
        const x = evt.nativeEvent.locationX;
        let ratio = Math.max(0, Math.min(1, x / SLIDER_WIDTH));
        if (ratio > 0.99) ratio = 0.99;

        animatedValue.setValue(ratio);
        progressRef.current = ratio;

        const newMs = ratio * actualDuration;
        onProgressChange?.(newMs);
        
        seekAudio(newMs); 

        isDragging.current = false;

        // Ждем 500мс, чтобы плеер обновил currentTime, и только потом снимаем блокировку
        setTimeout(() => {
          isSeeking.current = false;
          if (isActiveRef.current) startTimer();
        }, 500);
      },
      
      onPanResponderTerminate: (evt: GestureResponderEvent) => {
        const x = evt.nativeEvent.locationX;
        let ratio = Math.max(0, Math.min(1, x / SLIDER_WIDTH));
        if (ratio > 0.99) ratio = 0.99;

        animatedValue.setValue(ratio);
        progressRef.current = ratio;

        const newMs = ratio * actualDuration;
        onProgressChange?.(newMs);
        seekAudio(newMs);

        isDragging.current = false;

        setTimeout(() => {
          isSeeking.current = false;
          if (isActiveRef.current) startTimer();
        }, 500);
      }
    })
  ).current;

  const thumbPosition = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SLIDER_WIDTH - THUMB_SIZE],
  });

  return (
    <View style={styles.container}>
      <View 
        style={styles.sliderTrack} 
        {...panResponder.panHandlers}
        onLayout={(event) => {
          setSliderPageX(event.nativeEvent.layout.x);
        }}
      >
        <View style={styles.trackBg} />
        <Animated.View
          style={[
            styles.progressBar,
            { width: animatedValue.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) },
          ]}
        />
        <Animated.View style={[styles.thumb, { transform: [{ translateX: thumbPosition }] }]} />
      </View>
    </View>
  );
}