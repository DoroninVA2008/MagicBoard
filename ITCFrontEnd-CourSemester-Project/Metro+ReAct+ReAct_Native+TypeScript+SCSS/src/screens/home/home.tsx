import ReAct, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, Card, Text } from 'react-native-paper'
import { bleManager } from '../../shared/ble'

export default function Home() {
    const [isBluetoothOn, setIsBluetoothOn] = useState(false);

    useEffect(() => {
      const subscription = bleManager.onStateChange((state) => {
        if (state === 'PoweredOn') {
          setIsBluetoothOn(true);
        } else {
          setIsBluetoothOn(false);
        }
      }, true);

      return () => {
        subscription.remove();
      };
    }, []);

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineMedium">MagicBoard</Text>
           <Text variant="bodyMedium" style={styles.subtitle}>
             Проект на React Native + TypeScript + Paper
           </Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={() => console.log('Нажато!')}>
            Нажми меня
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    padding: 8,
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.7,
  },
});