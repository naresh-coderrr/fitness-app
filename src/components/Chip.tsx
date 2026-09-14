import { Pressable, StyleSheet, Text } from 'react-native';
import { theme } from '../theme';

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
};

export function Chip({ label, selected, onPress, disabled = false }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        selected ? styles.selected : styles.idle,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text style={[styles.label, selected ? styles.labelSelected : styles.labelIdle]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: theme.size.tap,
    paddingHorizontal: theme.space.lg,
    borderRadius: theme.radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  idle: {
    backgroundColor: theme.color.surface,
    borderColor: theme.color.border,
  },
  selected: {
    backgroundColor: theme.color.primary,
    borderColor: theme.color.primary,
  },
  disabled: {
    opacity: theme.opacity.disabled,
  },
  pressed: {
    opacity: theme.opacity.pressed,
  },
  label: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
  },
  labelIdle: {
    color: theme.color.text,
  },
  labelSelected: {
    color: theme.color.onPrimary,
  },
});
