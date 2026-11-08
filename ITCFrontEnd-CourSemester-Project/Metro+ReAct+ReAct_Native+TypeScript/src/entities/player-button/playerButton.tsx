import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { useState, useEffect } from 'react'
import Inactiveplayer from '@/shared/images/in_active-player.svg'
import Activeplayer from '@/shared/images/active-player.svg'
import { MusicSlider } from '@/entities/music-slider'

interface PlayerButtonProps {
  onCommand?: (cmd: string) => void;
  onSeek?: (ms: number) => void;
  isPlaying?: boolean;
}

export const PlayerButton = ({
  onCommand,
  onSeek,
  isPlaying = false,
}: PlayerButtonProps) => {
  const [localPlaying, setLocalPlaying] = useState<boolean>(isPlaying)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [totalDuration, setTotalDuration] = useState<number>(0)

  useEffect(() => { setLocalPlaying(isPlaying); }, [isPlaying]);

  const handlePress = () => {
    const next = !localPlaying;
    setLocalPlaying(next);
    onCommand?.(next ? 'START' : 'PAUSE');
  };

  // Форматирование времени (секунды -> 0:05)
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <View>
      <TouchableOpacity style={{ marginHorizontal: 'auto' }} onPress={handlePress}>
        {localPlaying ? <Activeplayer /> : <Inactiveplayer />}
      </TouchableOpacity>
      
      <View style={styles.container}>
        <MusicSlider
          isActive={localPlaying}
          onProgressChange={(ms) => {
            onSeek?.(ms);
            setCurrentTime(ms / 1000); // Обновляем время
          }}
          onDurationChange={(dur) => setTotalDuration(dur / 1000)} // Забираем длительность
        />
        
        {/* ТАЙМЕР ВЕРНУЛСЯ */}
        <Text style={styles.timeText}>
          {formatTime(currentTime)} / {formatTime(totalDuration)}
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