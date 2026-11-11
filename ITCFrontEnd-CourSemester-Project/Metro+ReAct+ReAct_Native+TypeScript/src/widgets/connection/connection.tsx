import React, { useState } from 'react'
import { View, Text, TouchableOpacity, FlatList, Modal, Alert } from 'react-native'
import { requestBlePermissions } from '@/shared/bluetooth/permissions'
import { getManager, bleService } from '@/shared/bluetooth/ble'
import { styles } from '@/shared/bluetooth/styles'

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
      <View style={styles.container}>
        <Text style={styles.title}>
          {scanning ? 'Поиск доски…' : devices.length ? 'Найденные доски:' : 'Доски не найдены'}
        </Text>
        <FlatList
          data={devices}
          keyExtractor={(d) => d.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.item} onPress={() => connect(item.id)}>
              <Text style={styles.itemText}>{item.name ?? 'Без имени'}</Text>
              <Text style={styles.itemSub}>{item.id}</Text>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity style={styles.button} onPress={scan}>
          <Text style={styles.buttonText}>{scanning ? 'Сканирование…' : 'Искать снова'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.close} onPress={onClose}>
          <Text style={styles.closeText}>Закрыть</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};