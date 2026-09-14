export const theme = {
  color: {
    primary: '#2F6B4F',
    onPrimary: '#FFFFFF',
    background: '#F6F4F0',
    surface: '#FFFFFF',
    text: '#1F2933',
    textMuted: '#6B7280',
    border: '#E5E1DA',
    success: '#2F7D4A',
    warning: '#C4851A',
    danger: '#C44536',
    transparent: 'transparent',
    avatarPalette: [
      '#3D6B8A',
      '#4A7C59',
      '#8A5A3C',
      '#6B4F8A',
      '#3F7A7A',
      '#8A4F5C',
    ],
  },
  space: {
    none: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  size: {
    tap: 44,
    avatar: 48,
    avatarLg: 64,
    spinner: 24,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '600' as const,
    bold: '700' as const,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 24,
  },
  layout: {
    flexFill: 1,
  },
  interaction: {
    doubleTapMs: 700,
  },
  opacity: {
    disabled: 0.5,
    pressed: 0.85,
  },
} as const;

export type Theme = typeof theme;
