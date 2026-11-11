import React, { useRef, useEffect, useState } from 'react'
import { View, Animated, PanResponder, GestureResponderEvent, PanResponderGestureState } from 'react-native'
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio'
import { styles, SLIDER_WIDTH } from './styles'

const audioSource = require('@/shared/audios/AllMagicTale.m4a');

interface MusicSliderProps {
  taleId?: number;
  isActive: boolean;
  duration: number;
  initialProgress?: number;
  onProgressChange?: (ms: number) => void;
  onDurationChange?: (ms: number) => void;
}

const THUMB_SIZE = 20;

export const MusicSlider: React.FC<MusicSliderProps> = ({
  taleId = 0,
  isActive,
  duration = 10000,
  initialProgress = 0,
  onProgressChange,
  onDurationChange,
}) => {
  const animatedValue = useRef(new Animated.Value(initialProgress)).current;
  const isDragging = useRef(false);

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

  // Управление воспроизведением аудио
  useEffect(() => {
    if (!hasAudio) return;
    if (isActive) {
      player.play();
    } else {
      player.pause();
    }
  }, [isActive, hasAudio, player]);

  useEffect(() => {
    if (!hasAudio) return; // Для треков без аудио работает таймер

    const updateProgress = () => {
      if (status.duration > 0) {
        const ratio = status.currentTime / status.duration;
        animatedValue.setValue(ratio);
        progressRef.current = ratio;
        onProgressChange?.(status.currentTime * 1000);
      }
    };

    const interval = setInterval(updateProgress, 100);
    return () => clearInterval(interval);
  }, [status.currentTime, status.duration, hasAudio, onProgressChange, animatedValue]);

  const startTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!isActiveRef.current || hasAudio) return; // Если есть аудио, таймер не нужен

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
      onPanResponderGrant: () => {
        isDragging.current = true;
        if (intervalRef.current) clearInterval(intervalRef.current);
      },
      onPanResponderMove: (_evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        const x = gestureState.moveX - sliderPageX;
        const ratio = Math.max(0, Math.min(1, x / SLIDER_WIDTH));

        animatedValue.setValue(ratio);
        progressRef.current = ratio;
        seekAudio(ratio * actualDuration);
      },
      onPanResponderRelease: (_evt, gestureState) => {
        const x = gestureState.moveX - sliderPageX;
        let ratio = Math.max(0, Math.min(1, x / SLIDER_WIDTH));
        if (ratio > 0.99) ratio = 0.99;

        animatedValue.setValue(ratio);
        progressRef.current = ratio;

        const newMs = ratio * actualDuration;
        onProgressChange?.(newMs);
        seekAudio(newMs);

        isDragging.current = false;

        if (isActiveRef.current) {
          startTimer();
        }
      },
      onPanResponderTerminate: (_evt, gestureState) => {
        const x = gestureState.moveX - sliderPageX;
        let ratio = Math.max(0, Math.min(1, x / SLIDER_WIDTH));
        animatedValue.setValue(ratio);
        progressRef.current = ratio;

        const newMs = ratio * actualDuration;
        onProgressChange?.(newMs);
        seekAudio(newMs);

        isDragging.current = false;

        if (isActiveRef.current) {
          startTimer();
        }
      }
    }),
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