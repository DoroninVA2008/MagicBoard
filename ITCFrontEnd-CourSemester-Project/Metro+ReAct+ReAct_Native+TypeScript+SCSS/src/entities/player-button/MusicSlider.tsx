import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
} from 'react-native';

interface MusicSliderProps {
  duration: number; // длительность в миллисекундах
  isActive: boolean; // запустить/остановить ползунок
  onProgressChange?: (progress: number) => void; // callback при изменении прогресса
}

const MusicSlider: React.FC<MusicSliderProps> = ({
  duration,
  isActive,
  onProgressChange,
}) => {
  const [progress, setProgress] = useState(0); // прогресс от 0 до 1
  const animatedValue = useRef(new Animated.Value(0)).current;
  const startTimeRef = useRef<number | null>(null);
  const pausedProgressRef = useRef(0);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  const SLIDER_WIDTH = 300;
  const THUMB_SIZE = 20;

  // Настройка PanResponder для ручного управления
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // Останавливаем анимацию при касании
        if (animationRef.current) {
          clearInterval(animationRef.current);
        }
      },
      onPanResponderMove: (
        evt: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        const newProgress = Math.max(
          0,
          Math.min(
            1,
            (gestureState.moveX - 50) / SLIDER_WIDTH
          )
        );
        setProgress(newProgress);
        pausedProgressRef.current = newProgress;
        animatedValue.setValue(newProgress);
        onProgressChange?.(newProgress);
      },
      onPanResponderRelease: () => {
        // Возобновляем анимацию, если isActive === true
        if (isActive && progress < 1) {
          startTimeRef.current = Date.now() - progress * duration;
        }
      },
    })
  ).current;

  // Основная логика анимации
  useEffect(() => {
    if (isActive && duration > 0) {
      // Запускаем ползунок
      startTimeRef.current = Date.now() - pausedProgressRef.current * duration;

      animationRef.current = setInterval(() => {
        const elapsed = Date.now() - (startTimeRef.current || Date.now());
        const newProgress = Math.min(1, elapsed / duration);

        setProgress(newProgress);
        pausedProgressRef.current = newProgress;
        animatedValue.setValue(newProgress);
        onProgressChange?.(newProgress);

        // Останавливаем, когда достигли конца
        if (newProgress >= 1) {
          if (animationRef.current) {
            clearInterval(animationRef.current);
          }
        }
      }, 16); // ~60 FPS

      return () => {
        if (animationRef.current) {
          clearInterval(animationRef.current);
        }
      };
    } else {
      // Паузируем ползунок
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
      pausedProgressRef.current = progress;
    }
  }, [isActive, duration]);

  // Вычисляем позицию ползунка
  const thumbPosition = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SLIDER_WIDTH - THUMB_SIZE],
  });

  return (
    <View style={styles.container}>
      <View
        style={styles.sliderTrack}
        {...panResponder.panHandlers}
      >
        {/* Фон прогресса */}
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />

        {/* Ползунок (thumb) */}
        <Animated.View
          style={[
            styles.thumb,
            {
              transform: [{ translateX: thumbPosition }],
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  sliderTrack: {
    width: 300,
    height: 9,
    backgroundColor: '#7A7A7A',
    borderRadius: 20,
    justifyContent: 'center',
    paddingHorizontal: 10,
    position: 'relative',
  },
  progressBar: {
    height: 9,
    backgroundColor: '#F4FAFF', //123123
    borderRadius: 20,
    position: 'absolute',
    left: 0,
    top: '50%',
    marginTop: -5,
  },
  thumb: {
    width: 20,
    height: 20,
    backgroundColor: '#181818', //0
    borderRadius: 10,
    position: 'absolute',
    top: '50%',
    marginTop: -10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default MusicSlider;