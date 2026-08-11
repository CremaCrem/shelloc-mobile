import { Text, type TextProps } from 'react-native';

export type TypographyVariant = 'h1' | 'h2' | 'h3' | 'body' | 'label' | 'caption';
export type TypographyColor = 'ink' | 'inkMuted' | 'white';

interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  color?: TypographyColor;
  className?: string;
}

export function Typography({
  variant = 'body',
  color = 'ink',
  className = '',
  style,
  ...rest
}: TypographyProps) {
  let variantStyles = '';

  switch (variant) {
    case 'h1':
      variantStyles = 'text-3xl font-bold leading-tight'; // ~28px-30px
      break;
    case 'h2':
      variantStyles = 'text-2xl font-semibold leading-snug'; // ~24px
      break;
    case 'h3':
      variantStyles = 'text-lg font-medium leading-snug'; // ~18px
      break;
    case 'body':
      variantStyles = 'text-base font-normal leading-normal'; // ~16px
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
    case 'white':
      colorStyles = 'text-surface'; // using surface which is white
      break;
  }

  return (
    <Text
      className={`${variantStyles} ${colorStyles} ${className}`}
      style={style}
      {...rest}
    />
  );
}
