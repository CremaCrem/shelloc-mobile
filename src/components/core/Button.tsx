import React from 'react';
import { Pressable, type PressableProps, ActivityIndicator, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { type LucideIcon } from 'lucide-react-native';
import { Typography, type TypographyColor } from './Typography';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends PressableProps {
  label?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconRight?: LucideIcon;
  iconColor?: string;
  loading?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
  label,
  variant = 'primary',
  size = 'medium',
  icon: Icon,
  iconRight: IconRight,
  iconColor,
  loading = false,
  className = '',
  disabled,
  children,
  onPressIn,
  onPressOut,
  ...rest
}: ButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = (e: any) => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
    if (onPressIn) onPressIn(e);
  };

  const handlePressOut = (e: any) => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    if (onPressOut) onPressOut(e);
  };

  let variantStyles = 'bg-brand border border-brand';
  let defaultTextColor: TypographyColor = 'dark';
  let defaultIconColor = '#0B111E';

  switch (variant) {
    case 'primary':
      variantStyles = 'bg-brand border border-brand';
      defaultTextColor = 'dark';
      defaultIconColor = '#0B111E';
      break;
    case 'secondary':
      variantStyles = 'bg-surfaceElevated border border-surfaceBorder';
      defaultTextColor = 'ink';
      defaultIconColor = '#F8FAFC';
      break;
    case 'danger':
      variantStyles = 'bg-danger border border-danger';
      defaultTextColor = 'white';
      defaultIconColor = '#FFFFFF';
      break;
    case 'outline':
      variantStyles = 'bg-transparent border border-brand';
      defaultTextColor = 'brand';
      defaultIconColor = '#00F2FE';
      break;
    case 'ghost':
      variantStyles = 'bg-transparent border-0';
      defaultTextColor = 'inkMuted';
      defaultIconColor = '#94A3B8';
      break;
  }

  if (disabled || loading) {
    variantStyles += ' opacity-50';
  }

  let sizeStyles = 'px-5 py-3 min-h-[44px]';
  let iconSize = 18;
  let labelVariant: 'label' | 'body' | 'caption' = 'label';

  switch (size) {
    case 'small':
      sizeStyles = 'px-3.5 py-1.5 min-h-[36px]';
      iconSize = 14;
      labelVariant = 'caption';
      break;
    case 'medium':
      sizeStyles = 'px-5 py-2.5 min-h-[44px]';
      iconSize = 18;
      labelVariant = 'label';
      break;
    case 'large':
      sizeStyles = 'px-6 py-3.5 min-h-[52px]';
      iconSize = 20;
      labelVariant = 'body';
      break;
  }

  const finalIconColor = iconColor || defaultIconColor;

  return (
    <AnimatedPressable
      className={`rounded-full flex-row items-center justify-center ${variantStyles} ${sizeStyles} ${className}`}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      accessibilityRole="button"
      style={animatedStyle}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator size="small" color={finalIconColor} />
      ) : (
        <>
          {Icon && (
            <View className={label || children ? 'mr-2' : ''}>
              <Icon size={iconSize} color={finalIconColor} />
            </View>
          )}

          {label && (
            <Typography
              variant={labelVariant}
              color={defaultTextColor}
              className="font-semibold text-center"
            >
              {label}
            </Typography>
          )}

          {children}

          {IconRight && (
            <View className={label || children ? 'ml-2' : ''}>
              <IconRight size={iconSize} color={finalIconColor} />
            </View>
          )}
        </>
      )}
    </AnimatedPressable>
  );
}
