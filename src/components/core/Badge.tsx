import React from 'react';
import { View, type ViewProps } from 'react-native';
import { Typography } from './Typography';

export type BadgeStatus = 'leaf' | 'amber' | 'danger' | 'neutral';

interface BadgeProps extends ViewProps {
  label: string;
  status?: BadgeStatus;
}

export function Badge({ label, status = 'neutral', className = '', ...rest }: BadgeProps) {
  let bgClass = '';
  let textColor: 'white' | 'ink' | 'inkMuted' = 'white';

  switch (status) {
    case 'leaf':
      bgClass = 'bg-leaf';
      break;
    case 'amber':
      bgClass = 'bg-amber';
      textColor = 'ink'; // Darker text for yellow backgrounds for contrast
      break;
    case 'danger':
      bgClass = 'bg-danger';
      break;
    case 'neutral':
      bgClass = 'bg-surfaceMuted';
      textColor = 'inkMuted';
      break;
  }

  return (
    <View
      className={`rounded-full px-2.5 py-1 flex-row items-center justify-center self-start ${bgClass} ${className}`}
      {...rest}
    >
      <Typography variant="caption" color={textColor} className="font-semibold text-center leading-none">
        {label}
      </Typography>
    </View>
  );
}
