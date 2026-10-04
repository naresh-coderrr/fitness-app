import { StyleSheet, Text } from 'react-native';
import { theme } from '../theme';
import { Screen } from './Screen';

type Props = {
  message: string;
};

export function StartupError({ message }: Props) {
  return (
    <Screen>
      <Text style={styles.title}>Can't start the app</Text>
      <Text style={styles.body}>{message}</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: theme.color.text,
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
  },
  body: {
    color: theme.color.textMuted,
    fontSize: theme.fontSize.md,
  },
});
