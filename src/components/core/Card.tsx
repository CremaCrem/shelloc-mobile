import React from 'react';
import { View, Pressable, type ViewProps, type PressableProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'highlight' | 'glass';

interface BaseCardProps {
  className?: string;
  variant?: CardVariant;
  children: React.ReactNode;
}

type CardProps = BaseCardProps &
  (
    | ({ onPress?: never } & ViewProps)
    | ({ onPress: NonNullable<PressableProps['onPress']> } & PressableProps)
  );

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Card({
  className = '',
  variant = 'default',
  children,
  onPress,
  ...rest
}: CardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = (e: any) => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
    if ('onPressIn' in rest && rest.onPressIn) {
      rest.onPressIn(e);
    }
  };

  const handlePressOut = (e: any) => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    if ('onPressOut' in rest && rest.onPressOut) {
      rest.onPressOut(e);
    }
  };

  let variantStyles = 'bg-surface border border-surfaceBorder';
  switch (variant) {
    case 'elevated':
      variantStyles = 'bg-surfaceElevated border border-surfaceBorder shadow-md';
      break;
    case 'outlined':
      variantStyles = 'bg-transparent border border-surfaceBorder';
      break;
    case 'highlight':
      variantStyles = 'bg-surface border border-brand/50 shadow-sm';
      break;
    case 'glass':
      variantStyles = 'bg-glass border border-glassBorder shadow-lg overflow-hidden';
      break;
    case 'default':
    default:
      variantStyles = 'bg-surface border border-surfaceBorder shadow-sm';
      break;
  }

  const baseStyles = `rounded-2xl p-5 ${variantStyles}`;

  if (onPress) {
    return (
      <AnimatedPressable
        className={`${baseStyles} ${className}`}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        style={animatedStyle}
        {...(rest as PressableProps)}
      >
        {variant === 'glass' && (
          <BlurView intensity={70} tint="dark" style={StyleSheet.absoluteFill} />
        )}
        {children}
      </AnimatedPressable>
    );
  }

  return (
    <View className={`${baseStyles} ${className}`} {...(rest as ViewProps)}>
      {variant === 'glass' && (
        <BlurView intensity={70} tint="dark" style={StyleSheet.absoluteFill} />
      )}
      {children}
    </View>
  );
}
