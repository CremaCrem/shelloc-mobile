import React from 'react';
import { View, TouchableOpacity, type ViewProps, type TouchableOpacityProps } from 'react-native';

interface BaseCardProps {
  className?: string;
  children: React.ReactNode;
}

type CardProps = BaseCardProps &
  (
    | ({ onPress?: never } & ViewProps)
    | ({ onPress: NonNullable<TouchableOpacityProps['onPress']> } & TouchableOpacityProps)
  );

export function Card({ className = '', children, onPress, ...rest }: CardProps) {
  const baseStyles = 'bg-surface rounded-3xl p-6 shadow-sm';

  if (onPress) {
    return (
      <TouchableOpacity
        className={`${baseStyles} ${className}`}
        onPress={onPress}
        activeOpacity={0.7}
        accessibilityRole="button"
        {...(rest as TouchableOpacityProps)}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View className={`${baseStyles} ${className}`} {...(rest as ViewProps)}>
      {children}
    </View>
  );
}
