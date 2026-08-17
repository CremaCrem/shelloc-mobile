import '@/global.css';
import { Platform } from 'react-native';

export const Colors = {
  dark: {
    background: '#0B111E',
    surface: '#151F32',
    surfaceElevated: '#1E293B',
    surfaceBorder: '#23334E',
    backgroundElement: '#151F32',
    backgroundSelected: '#1E293B',
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textSubtle: '#64748B',
    brand: '#00F2FE',
    leaf: '#10B981',
    danger: '#EF4444',
    amber: '#F59E0B',
  },
  light: {
    background: '#0B111E',
    surface: '#151F32',
    surfaceElevated: '#1E293B',
    surfaceBorder: '#23334E',
    backgroundElement: '#151F32',
    backgroundSelected: '#1E293B',
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textSubtle: '#64748B',
    brand: '#00F2FE',
    leaf: '#10B981',
    danger: '#EF4444',
    amber: '#F59E0B',
  },
} as const;

export type ThemeColor = keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
