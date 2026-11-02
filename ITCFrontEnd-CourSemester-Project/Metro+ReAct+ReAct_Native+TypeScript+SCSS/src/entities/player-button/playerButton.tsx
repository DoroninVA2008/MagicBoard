import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useState } from 'react';
import Inactiveplayer from '@/shared/images/in_active-player.svg';
import Activeplayer from '@/shared/images/active-player.svg';
import MusicSlider from './MusicSlider';

interface PlayerButtonProps {
  onCommand?: (cmd: string) => void; // Пропс для отправки команд
}

export const PlayerButton = ({ onCommand }: PlayerButtonProps) => {
  const [isFavorite, setFavorite] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const DURATION = 10000;

  const handlePress = () => {
    setFavorite(!isFavorite);
    onCommand?.(isFavorite ? 'PAUSE' : 'START'); // Отправляем команду
  };

  return (
    <View>
      <TouchableOpacity style={{ marginHorizontal: 'auto' }} onPress={handlePress}>
        {isFavorite ? <Activeplayer /> : <Inactiveplayer />}
      </TouchableOpacity>
      <View style={styles.container}>
        <MusicSlider
          duration={DURATION}
          isActive={isFavorite}
          onProgressChange={setCurrentProgress}
        />
        <Text style={styles.timeText}>
          {Math.floor((currentProgress * DURATION) / 1000)}s / {DURATION / 1000}s
        </Text>
      </View>
    </View>
  );
};