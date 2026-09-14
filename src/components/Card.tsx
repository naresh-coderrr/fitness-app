import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '../theme';

type Props = {
  children: ReactNode;
};

export function Card({ children }: Props) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.color.surface,
    borderRadius: theme.radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.color.border,
    padding: theme.space.lg,
    gap: theme.space.md,
  },
});
