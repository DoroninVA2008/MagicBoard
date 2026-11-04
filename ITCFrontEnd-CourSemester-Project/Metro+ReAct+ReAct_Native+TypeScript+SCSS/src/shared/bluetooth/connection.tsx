import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, Modal, StyleSheet, Alert,
} from 'react-native';
import { COLORS } from '@/shared/constant';
import { requestBlePermissions } from './permissions';
import { bleService } from './ble';
import { getManager } from './ble';

interface Props {
  visible: boolean;
  onClose: () => void;
}

type Scanned = { id: string; name: string | null };

export const ConnectionModal = ({ visible, onClose }: Props) => {
  const [devices, setDevices] = useState<Scanned[]>([]);
  const [scanning, setScanning] = useState(false);

  const scan = async () => {
    const ok = await requestBlePermissions();
    if (!ok) {
      Alert.alert('Нет разрешений', 'Разрешите Bluetooth для поиска доски');
      return;
    }
    let manager;
    try {
      manager = getManager();
    } catch {
      Alert.alert('Web', 'Bluetooth недоступен в браузере');
      return;
    }
    const adapterState = await manager.state();
    if (adapterState !== 'PoweredOn') {
      Alert.alert('Bluetooth выключен', 'Включите Bluetooth и попробуйте снова');
      return;
    }

    setDevices([]);
    setScanning(true);
    manager.startDeviceScan(null, null, (err, dev) => {
      if (err) {
        setScanning(false);
        Alert.alert('Ошибка сканирования', err.message);
        return;
      }
      const name = dev?.name ?? dev?.localName ?? '';
      if (name.startsWith('MagicBoard') && dev) {
        setDevices((prev) =>
          prev.some((d) => d.id === dev.id) ? prev : [...prev, { id: dev.id, name: dev.name }],
        );
      }
    });

    setTimeout(() => {
      manager.stopDeviceScan();
      setScanning(false);
    }, 10000);
  };

  const connect = async (id: string) => {
    getManager().stopDeviceScan();
    await bleService.connectById(id);
    onClose();
  };

  return (
    <Modal visible={visible} onRequestClose={onClose} animationType="slide">
      <View style={s.container}>
        <Text style={s.title}>
          {scanning ? 'Поиск доски…' : devices.length ? 'Найденные доски:' : 'Доски не найдены'}
        </Text>
        <FlatList
          data={devices}
          keyExtractor={(d) => d.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={s.item} onPress={() => connect(item.id)}>
              <Text style={s.itemText}>{item.name ?? 'Без имени'}</Text>
              <Text style={s.itemSub}>{item.id}</Text>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity style={s.button} onPress={scan}>
          <Text style={s.buttonText}>{scanning ? 'Сканирование…' : 'Искать снова'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.close} onPress={onClose}>
          <Text style={s.closeText}>Закрыть</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const s = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: COLORS.HOME_BACKGROUND_SUN },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 16, color: COLORS.TEXT },
  item: { padding: 14, backgroundColor: '#fff', borderRadius: 12, marginBottom: 10 },
  itemText: { fontSize: 14, fontWeight: '600', color: COLORS.BLACK_TEXT },
  itemSub: { fontSize: 11, color: '#666' },
  button: { padding: 14, backgroundColor: COLORS.BACKGROUND_ACCENT, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  buttonText: { fontWeight: '700', color: COLORS.BUTTON_TEXT },
  close: { padding: 14, alignItems: 'center' },
  closeText: { color: COLORS.TEXT },
});