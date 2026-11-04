// react imports
import { createStackNavigator } from "@react-navigation/stack";
import { View, Platform } from "react-native";
// import pages
import Home from "@/pages/home/ui/home";
import { Management } from "@/pages/manegement";
import { ScreenOfTale } from "@/pages/screen-of-tale/ui";

type RootStackParamList = {
  HomeScreen: undefined,
  ManagementScreen: { imageUrl: string; name: string; author: string },
  TaleScreen: { imageUrl: string; name: string; author: string },
};

if (Platform.OS === 'web' && typeof window !== 'undefined') {
  // Отключаем встроенный overlay, чтобы не падал на raw.logs
  const origError = console.error;
  console.error = (...args: any[]) => {
    // eslint-disable-next-line no-console
    origError.apply(console, args);
  };
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
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