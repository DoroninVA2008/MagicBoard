import { createStackNavigator } from '@react-navigation/stack'
import { View, Platform } from 'react-native'
import Home from '@/pages/home/ui/home'
import { Management } from '@/pages/management'
import { ScreenOfTale } from '@/pages/screen-of-tale/ui'

type RootStackParamList = {
  HomeScreen: undefined,
  ManagementScreen: { inDev: string; imageUrl: string; name: string; author: string },
  TaleScreen: { inDev: string; imageUrl: string; name: string; author: string },
};

if (Platform.OS === 'web' && typeof window !== 'undefined') {
  const origError = console.error;

  console.error = (...args: any[]) => {
    origError.apply(console, args);
  };
  try {
    const { LogBox } = require('react-native');
    LogBox?.ignoreAllLogs?.(true);
  } catch {}
}

const Index = () => {
  const Stack = createStackNavigator<RootStackParamList>()
  
  return (
      <View style={{ flex: 1 }}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="HomeScreen"
            component={Home}
          />
          <Stack.Screen
            name="ManagementScreen"
            component={Management}
          />
          <Stack.Screen
            name="TaleScreen"
            component={ScreenOfTale}
          />
        </Stack.Navigator>
      </View>
  )
}

export default Index