import { Stack } from 'expo-router';
import { theme } from '../../src/theme';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.color.surface },
        headerTintColor: theme.color.text,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: theme.color.background },
      }}
    />
  );
}
