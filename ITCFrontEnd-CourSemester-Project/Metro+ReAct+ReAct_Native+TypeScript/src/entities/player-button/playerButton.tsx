import { View, TouchableOpacity, Text } from 'react-native'
import { useState, useEffect } from 'react'
import { styles } from './styles'
import Inactiveplayer from '@/shared/images/in_active-player.svg'
import Activeplayer from '@/shared/images/active-player.svg'
import { MusicSlider } from '@/entities/music-slider'

interface PlayerButtonProps {
  taleId?: number;
  onCommand?: (cmd: string) => void;
  onSeek?: (ms: number) => void;
  isPlaying?: boolean;
}

export const PlayerButton = ({
  taleId = 0,
  onCommand,
  onSeek,
  isPlaying = false,
}: PlayerButtonProps) => {
  const [localPlaying, setLocalPlaying] = useState<boolean>(isPlaying)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [totalDuration, setTotalDuration] = useState<number>(10000)

  useEffect(() => { setLocalPlaying(isPlaying); }, [isPlaying]);

  const handlePress = () => {
    const next = !localPlaying;
    setLocalPlaying(next);
    onCommand?.(next ? 'START' : 'PAUSE');
  };

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
          taleId={taleId}
          isActive={localPlaying}
          duration={totalDuration}
          onProgressChange={(ms) => {
            onSeek?.(ms);
            setCurrentTime(ms);
          }}
          onDurationChange={(dur) => setTotalDuration(dur)}
        />
        
        <Text style={styles.timeText}>
          {formatTime(currentTime / 1000)} / {formatTime(totalDuration / 1000)}
        </Text>
      </View>
    </View>
  );
};