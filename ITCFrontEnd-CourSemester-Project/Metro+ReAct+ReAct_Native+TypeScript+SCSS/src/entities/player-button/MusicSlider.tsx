import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, PanResponder, GestureResponderEvent, PanResponderGestureState } from 'react-native';

interface MusicSliderProps {
  duration: number;
  isActive: boolean;
  initialProgress?: number;  // 0..1
  onProgressChange?: (ratio: number) => void;  // 0..1
}

const SLIDER_WIDTH = 300;
const THUMB_SIZE = 20;

const MusicSlider: React.FC<MusicSliderProps> = ({
  duration,
  isActive,
  initialProgress = 0,
  onProgressChange,
}) => {
  const [progress, setProgress] = useState(initialProgress);
  const animatedValue = useRef(new Animated.Value(initialProgress)).current;
  const startTimeRef = useRef<number | null>(null);
  const pausedProgressRef = useRef(initialProgress);
  const animationRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        if (animationRef.current) clearInterval(animationRef.current);
      },
      onPanResponderMove: (_e: GestureResponderEvent, g: PanResponderGestureState) => {
        const ratio = Math.max(0, Math.min(1, (g.moveX - 50) / SLIDER_WIDTH));
        setProgress(ratio);
        pausedProgressRef.current = ratio;
        animatedValue.setValue(ratio);
        onProgressChange?.(ratio);
      },
      onPanResponderRelease: () => {
        if (isActive && progress < 1) {
          startTimeRef.current = Date.now() - progress * duration;
        }
      },
    }),
  ).current;

  useEffect(() => {
    if (isActive && duration > 0) {
      startTimeRef.current = Date.now() - pausedProgressRef.current * duration;
      animationRef.current = setInterval(() => {
        const elapsed = Date.now() - (startTimeRef.current ?? Date.now());
        const next = Math.min(1, elapsed / duration);
        setProgress(next);
        pausedProgressRef.current = next;
        animatedValue.setValue(next);
        onProgressChange?.(next);
        if (next >= 1 && animationRef.current) clearInterval(animationRef.current);
      }, 16);
      return () => { if (animationRef.current) clearInterval(animationRef.current); };
    } else {
      if (animationRef.current) clearInterval(animationRef.current);
      pausedProgressRef.current = progress;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, duration]);

  useEffect(() => {
    animatedValue.setValue(initialProgress);
    setProgress(initialProgress);
  }, [initialProgress, animatedValue]);

  const thumbPosition = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SLIDER_WIDTH - THUMB_SIZE],
  });

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
  );
};

const styles = StyleSheet.create({
  container: { justifyContent: 'center', alignItems: 'center', paddingVertical: 20 },
  sliderTrack: { width: SLIDER_WIDTH, height: 9, backgroundColor: '#7A7A7A', borderRadius: 20, justifyContent: 'center', paddingHorizontal: 10, position: 'relative' },
  progressBar: { height: 9, backgroundColor: '#F4FAFF', borderRadius: 20, position: 'absolute', left: 0, top: '50%', marginTop: -5 },
  thumb: { width: 20, height: 20, backgroundColor: '#181818', borderRadius: 10, position: 'absolute', top: '50%', marginTop: -10 },
});

export default MusicSlider;