import { useRef } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';
import { theme } from '../theme';

type Variant = 'primary' | 'secondary' | 'ghost';

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
}: Props) {
  const locked = useRef(false);
  const isDisabled = disabled || loading;

  const handlePress = () => {
    if (isDisabled || locked.current) {
      return;
    }
    locked.current = true;
    onPress();
    setTimeout(() => {
      locked.current = false;
    }, theme.interaction.doubleTapMs);
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === 'primary' ? theme.color.onPrimary : theme.color.primary
          }
          size="small"
        />
      ) : (
        <Text style={[styles.label, labelStyles[variant]]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: theme.size.tap,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.space.lg,
    alignItems: 'center',
    justifyContent: 'center',
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
});

const variantStyles = StyleSheet.create({
  primary: {
    backgroundColor: theme.color.primary,
  },
  secondary: {
    backgroundColor: theme.color.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.color.border,
  },
  ghost: {
    backgroundColor: theme.color.transparent,
  },
});

const labelStyles = StyleSheet.create({
  primary: {
    color: theme.color.onPrimary,
  },
  secondary: {
    color: theme.color.text,
  },
  ghost: {
    color: theme.color.primary,
  },
});
