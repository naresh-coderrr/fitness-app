import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';
import { Button } from './Button';

type LoadingProps = {
  status: 'loading';
};

type EmptyProps = {
  status: 'empty';
  message: string;
  actionLabel: string;
  onAction: () => void;
};

type ErrorProps = {
  status: 'error';
  message: string;
  onRetry: () => void;
};

type Props = LoadingProps | EmptyProps | ErrorProps;

export function StateView(props: Props) {
  if (props.status === 'loading') {
    return (
      <View style={styles.wrap}>
        <ActivityIndicator color={theme.color.primary} size="small" />
        <Text style={styles.message}>Loading…</Text>
      </View>
    );
  }

  if (props.status === 'empty') {
    return (
      <View style={styles.wrap}>
        <Text style={styles.message}>{props.message}</Text>
        <Button label={props.actionLabel} onPress={props.onAction} />
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <Text style={styles.message}>{props.message}</Text>
      <Button label="Try again" onPress={props.onRetry} variant="secondary" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: theme.space.md,
    paddingVertical: theme.space.lg,
  },
  message: {
    color: theme.color.textMuted,
    fontSize: theme.fontSize.md,
    textAlign: 'center',
  },
});
