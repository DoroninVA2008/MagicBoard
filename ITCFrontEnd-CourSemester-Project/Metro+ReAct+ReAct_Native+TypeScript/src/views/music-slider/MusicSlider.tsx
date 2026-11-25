import React, { useRef, useEffect, useState } from 'react'
import { View, Animated, PanResponder, GestureResponderEvent, PanResponderGestureState } from 'react-native'
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio'
import type { MusicSliderProps } from '@/views/music-slider'
import { styles } from '@/views/music-slider/styles'

const audioSource = require('#/audios/AllMagicTale.m4a');
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

  const player = useAudioPlayer(audioSource);
  const status = useAudioPlayerStatus(player);

  const hasAudio = taleId === 1;
  const actualDuration = hasAudio && status.duration > 0
    ? status.duration * 1000
    : duration;

  useEffect(() => {
    onDurationChange?.(actualDuration);
  }, [actualDuration, onDurationChange]);

  useEffect(() => {
    if (!hasAudio) return;
    if (isActive) {
      player.play();
    } else {
      player.pause();
    }
  }, [isActive, hasAudio, player]);

  useEffect(() => {
    if (!hasAudio || isDragging.current || isSeeking.current) return; 

    if (status.duration > 0) {
      const ratio = status.currentTime / status.duration;
      animatedValue.setValue(ratio);
      progressRef.current = ratio;
      onProgressChange?.(status.currentTime * 1000);
    }
  }, [status.currentTime, status.duration, hasAudio, onProgressChange, animatedValue]);

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

  const thumbPosition = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SLIDER_WIDTH - THUMB_SIZE],
  });

  return (
    <View style={styles.container}>
      <View 
        style={styles.sliderTrack} 
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