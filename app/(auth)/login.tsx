import { Stack } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import { Screen } from '../../src/components';
import { theme } from '../../src/theme';

export default function LoginScreen() {
  return (
    <Screen>
      <Stack.Screen options={{ title: 'Login' }} />
      <Text style={styles.title}>Login</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: theme.color.text,
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
  },
});
