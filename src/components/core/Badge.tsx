import React from 'react';
import { View, type ViewProps } from 'react-native';
import { Typography, type TypographyColor } from './Typography';

export type BadgeStatus = 'leaf' | 'amber' | 'danger' | 'brand' | 'neutral';

interface BadgeProps extends ViewProps {
  label: string;
  status?: BadgeStatus;
  showDot?: boolean;
  size?: 'sm' | 'md';
}

export function Badge({
  label,
  status = 'neutral',
  showDot = true,
  size = 'sm',
  className = '',
  ...rest
}: BadgeProps) {
  let bgClass = 'bg-surfaceElevated border border-surfaceBorder';
  let dotClass = 'bg-inkSubtle';
  let textColor: TypographyColor = 'inkMuted';

  switch (status) {
    case 'leaf':
      bgClass = 'bg-leafMuted border border-leaf/40';
      dotClass = 'bg-leaf';
      textColor = 'leaf';
      break;
    case 'amber':
      bgClass = 'bg-amberMuted border border-amber/40';
      dotClass = 'bg-amber';
      textColor = 'amber';
      break;
    case 'danger':
      bgClass = 'bg-dangerMuted border border-danger/40';
      dotClass = 'bg-danger';
      textColor = 'danger';
      break;
    case 'brand':
      bgClass = 'bg-brandMuted border border-brand/40';
      dotClass = 'bg-brand';
      textColor = 'brand';
      break;
    case 'neutral':
    default:
      bgClass = 'bg-surfaceElevated border border-surfaceBorder';
      dotClass = 'bg-inkSubtle';
      textColor = 'inkMuted';
      break;
  }

  const paddingClass = size === 'sm' ? 'px-2.5 py-1' : 'px-3.5 py-1.5';
  const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2';

  return (
    <View
      className={`rounded-full flex-row items-center justify-center self-start flex-shrink ${paddingClass} ${bgClass} ${className}`}
      {...rest}
    >
      {showDot && (
        <View className={`${dotSize} rounded-full ${dotClass} mr-1.5 flex-shrink-0`} />
      )}
      <Typography
        variant="caption"
        color={textColor}
        className="font-semibold uppercase tracking-wider text-center leading-none flex-shrink"
        numberOfLines={1}
        adjustsFontSizeToFit={true}
        minimumFontScale={0.7}
      >
        {label}
      </Typography>
    </View>
  );
}
