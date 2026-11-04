import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { COLORS } from '@/shared/constant';
import { BackgroundSun } from '@/entities/background/Sun';
import { BackgroundMoon } from '@/entities/background/Moon';
import BatteryIcon from '@/shared/images/battery.svg';
import BluetoothIcon from '@/shared/images/bluetooth-icon.svg';
import { PlayerButton } from '@/entities/player-button';
import { Footer } from '@/widgets/footer';
import { useBle } from '@/shared/bluetooth/useBle';
import { ConnectionModal } from '@/shared/bluetooth/connection';

interface TaleListProps {
  route: {
    params?: {
      imageUrl: string;
      name: string;
      author: string;
    };
  };
}

export const Management = ({ route }: TaleListProps) => {
  const {
    imageUrl = 'https://www.radionetplus.ru/uploads/posts/2013-12/1387478876_krasivye-fotki-1.jpeg',
    name = 'Unknown Tale',
    author = 'Unknown Author',
  } = route.params || {};

  const dateLogin = new Date().getHours();
  const { status, battery, progress, duration, isPlaying, sendCommand, seek } = useBle();
  const [showConnect, setShowConnect] = useState(false);

  const statusLabel =
    status === 'connected' ? 'Подключено' :
    status === 'connecting' ? 'Соединение…' :
    status === 'disconnected' ? 'Отключено' :
    status === 'error' ? 'Ошибка' :
    'Не подключено';

  return (
    <View style={{ flex: 1, backgroundColor: dateLogin < 19 && dateLogin > 7 ? COLORS.HOME_BACKGROUND_SUN : COLORS.HOME_BACKGROUND_MOON }}>
      {dateLogin < 19 && dateLogin > 7 ? <BackgroundSun /> : <BackgroundMoon />}

      <View style={{ flex: 1, marginTop: 50, marginHorizontal: '6%', rowGap: 10 }}>
        <View style={{ flexDirection: 'row', columnGap: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 5 }}>
            <BluetoothIcon width={20} height={20} />
            <Text style={{ color: COLORS.TEXT, fontSize: 12 }}>{statusLabel}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 5 }}>
            <BatteryIcon width={20} height={20} />
            <Text style={{ color: COLORS.TEXT, fontSize: 12 }}>
              {battery !== null ? `${battery}%` : '--'}
            </Text>
          </View>
        </View>

        {status !== 'connected' && (
          <TouchableOpacity onPress={() => setShowConnect(true)}>
            <Text style={{ color: COLORS.TEXT, fontSize: 14, textDecorationLine: 'underline' }}>
              Подключиться
            </Text>
          </TouchableOpacity>
        )}

        <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.TEXT }}>Magic Board 1v</Text>

        <Image
          source={require('@/shared/images/crasnaya_shapochka-tale.jpg')}
          style={style.imageBoard}
        />

        <View style={{ backgroundColor: COLORS.MANAGEMENR_BACKGROUND_BIG, borderRadius: 20, height: '40%', marginTop: 20 }}>
          <View style={{ backgroundColor: COLORS.MANAGEMENR_BACKGROUND_SMALE, borderRadius: 20, height: '80%', width: '90%', margin: 'auto' }}>
            <View style={{ flexDirection: 'row', marginHorizontal: '8%', marginTop: 18, columnGap: 14 }}>
              <Image source={{ uri: imageUrl }} style={{ width: 136, height: 136, borderRadius: 10 }} />
              <View>
                <Text style={{ fontSize: 11, fontWeight: '400', color: COLORS.MANAGEMENT_AUTOR }}>Magic Board 1v</Text>
                <Text style={{ fontSize: 13, fontWeight: '800', color: COLORS.BLACK_TEXT }}>{name}</Text>
                <Text style={{ fontSize: 11, fontWeight: '600', color: COLORS.MANAGEMENT_AUTOR }}>{author}</Text>
              </View>
            </View>
            <View style={{ marginHorizontal: 'auto', marginTop: 15 }}>
              <PlayerButton
                onCommand={sendCommand}
                onSeek={seek}
                isPlaying={isPlaying}
                duration={duration}
                progress={progress}
              />
            </View>
          </View>
        </View>
      </View>

      <ConnectionModal visible={showConnect} onClose={() => setShowConnect(false)} />
      <Footer />
    </View>
  );
};

const style = StyleSheet.create({
  imageBoard: { width: '80%', height: '42%', borderRadius: 20, marginHorizontal: 'auto' },
});