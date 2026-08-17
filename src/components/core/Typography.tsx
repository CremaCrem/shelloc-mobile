import React from 'react';
import { Text, type TextProps } from 'react-native';

export type TypographyVariant = 'h1' | 'h2' | 'h3' | 'body' | 'label' | 'caption';
export type TypographyColor = 
  | 'ink' 
  | 'inkMuted' 
  | 'inkSubtle' 
  | 'brand' 
  | 'leaf' 
  | 'danger' 
  | 'amber' 
  | 'white' 
  | 'dark';

interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  color?: TypographyColor;
  className?: string;
  children?: React.ReactNode;
}

export function Typography({
  variant = 'body',
  color = 'ink',
  className = '',
  style,
  children,
  ...rest
}: TypographyProps) {
  let variantStyles = '';

  switch (variant) {
    case 'h1':
      variantStyles = 'text-3xl font-bold leading-tight tracking-tight'; // ~28px-30px
      break;
    case 'h2':
      variantStyles = 'text-2xl font-semibold leading-snug tracking-tight'; // ~22px-24px
      break;
    case 'h3':
      variantStyles = 'text-lg font-semibold leading-snug'; // ~18px
      break;
    case 'body':
      variantStyles = 'text-base font-normal leading-relaxed'; // ~16px
      break;
    case 'label':
      variantStyles = 'text-sm font-medium leading-normal'; // ~14px
      break;
    case 'caption':
      variantStyles = 'text-xs font-normal leading-normal'; // ~12px
      break;
  }

  let colorStyles = '';
  switch (color) {
    case 'ink':
      colorStyles = 'text-ink';
      break;
    case 'inkMuted':
      colorStyles = 'text-inkMuted';
      break;
    case 'inkSubtle':
      colorStyles = 'text-inkSubtle';
      break;
    case 'brand':
      colorStyles = 'text-brand';
      break;
    case 'leaf':
      colorStyles = 'text-leaf';
      break;
    case 'danger':
      colorStyles = 'text-danger';
      break;
    case 'amber':
      colorStyles = 'text-amber';
      break;
    case 'white':
      colorStyles = 'text-white';
      break;
    case 'dark':
      colorStyles = 'text-inkDark';
      break;
  }

  return (
    <Text
      className={`${variantStyles} ${colorStyles} ${className}`}
      style={style}
      {...rest}
    >
      {children}
    </Text>
  );
}
