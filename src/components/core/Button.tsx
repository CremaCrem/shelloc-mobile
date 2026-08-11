import React from 'react';
import { Pressable, type PressableProps, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Typography } from './Typography';

export type ButtonVariant = 'primary' | 'secondary' | 'outline';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends PressableProps {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
  label,
  variant = 'primary',
  size = 'medium',
  className = '',
  disabled,
  onPressIn,
  onPressOut,
  ...rest
}: ButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = (e: any) => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
    if (onPressIn) onPressIn(e);
  };

  const handlePressOut = (e: any) => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    if (onPressOut) onPressOut(e);
  };

  let variantStyles = '';
  let labelColor: 'white' | 'ink' | 'inkMuted' = 'ink';

  switch (variant) {
    case 'primary':
      variantStyles = 'bg-sky border border-sky';
      labelColor = 'white';
      break;
    case 'secondary':
      variantStyles = 'bg-surfaceMuted border border-surfaceMuted';
      labelColor = 'ink';
      break;
    case 'outline':
      variantStyles = 'bg-transparent border border-sky';
      labelColor = 'ink'; // or maybe sky, but we only have ink in Typography atm
      break;
  }

  if (disabled) {
    variantStyles = 'bg-surfaceMuted border border-surfaceMuted opacity-50';
    labelColor = 'inkMuted';
  }

  let sizeStyles = '';
  let labelVariant: 'label' | 'body' = 'body';
  switch (size) {
    case 'small':
      sizeStyles = 'px-4 py-2 min-h-[36px]';
      labelVariant = 'label';
      break;
    case 'medium':
      sizeStyles = 'px-6 py-3 min-h-[44px]';
      labelVariant = 'body';
      break;
    case 'large':
      sizeStyles = 'px-8 py-4 min-h-[56px]';
      labelVariant = 'body';
      break;
  }

  return (
    <AnimatedPressable
      className={`rounded-full flex-row items-center justify-center ${variantStyles} ${sizeStyles} ${className}`}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      accessibilityRole="button"
      style={animatedStyle}
      {...rest}
    >
      <Typography variant={labelVariant} color={labelColor} className={variant === 'outline' ? 'text-sky' : ''}>
        {label}
      </Typography>
    </AnimatedPressable>
  );
}
