import 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../src/theme';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerTitle: 'Fitness Circle',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: theme.color.surface },
          headerTintColor: theme.color.text,
          contentStyle: { backgroundColor: theme.color.background },
        }}
      />
    </>
  );
}
