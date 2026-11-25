import React, { type FC, useState, useEffect } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { MusicSlider } from '@/views/music-slider'
export type { PlayerButtonProps } from '@/widgets/playton'
import { styles } from '@/widgets/playton/styles'
import Inactiveplayer from '#/images/in_active-player.svg'
import Activeplayer from '#/images/active-player.svg'

export const PlayerButton: React.FC = ({
  taleId = 0,
  onCommand,
  onSeek,
  isPlaying = false,
}: PlayerButtonProps) => {
  const [localPlaying, setLocalPlaying] = useState<boolean>(isPlaying)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [totalDuration, setTotalDuration] = useState<number>(1000)

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