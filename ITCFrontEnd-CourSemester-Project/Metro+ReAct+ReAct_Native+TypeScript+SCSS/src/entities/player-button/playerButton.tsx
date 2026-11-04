import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import Inactiveplayer from '@/shared/images/in_active-player.svg';
import Activeplayer from '@/shared/images/active-player.svg';
import MusicSlider from './MusicSlider';

interface PlayerButtonProps {
  onCommand?: (cmd: string) => void;
  onSeek?: (ms: number) => void;
  isPlaying?: boolean;
  duration?: number;
  progress?: number;
}

export const PlayerButton = ({
  onCommand,
  onSeek,
  isPlaying = false,
  duration = 10000,
  progress = 0,
}: PlayerButtonProps) => {
  const [localPlaying, setLocalPlaying] = useState<boolean>(isPlaying);
  const [currentProgress, setCurrentProgress] = useState<number>(progress);

  useEffect(() => { setLocalPlaying(isPlaying); }, [isPlaying]);
  useEffect(() => { setCurrentProgress(progress); }, [progress]);

  const handlePress = () => {
    const next = !localPlaying;
    setLocalPlaying(next);
    onCommand?.(next ? 'START' : 'PAUSE');
  };

  const handleProgressChange = (ratio: number) => {
    const safeDuration = duration > 0 ? duration : 10000;
    const ms = Math.round(ratio * safeDuration);
    setCurrentProgress(ms);
    onSeek?.(ms);
  };

  const safeDuration = duration > 0 ? duration : 10000;

  return (
    <View>
      <TouchableOpacity style={{ marginHorizontal: 'auto' }} onPress={handlePress}>
        {localPlaying ? <Activeplayer /> : <Inactiveplayer />}
      </TouchableOpacity>
      <View style={styles.container}>
        <MusicSlider
          duration={safeDuration}
          isActive={localPlaying}
          initialProgress={currentProgress / safeDuration}
          onProgressChange={handleProgressChange}
        />
        <Text style={styles.timeText}>
          {Math.floor(currentProgress / 1000)}s / {Math.floor(safeDuration / 1000)}s
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginTop: 30
  },
  timeText: {
    fontSize: 16,
    marginTop: 20,
    color: '#666666'
  },
});