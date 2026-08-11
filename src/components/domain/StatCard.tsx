import React from 'react';
import { View } from 'react-native';
import { Card } from '../core/Card';
import { Typography } from '../core/Typography';
import { Badge, type BadgeStatus } from '../core/Badge';
import { Sparkline } from './Sparkline';
import { LucideIcon } from 'lucide-react-native';

export type StatCategory = 'turbidity' | 'ph' | 'tds' | 'general';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  category: StatCategory;
  status?: BadgeStatus;
  statusLabel?: string;
  icon: LucideIcon;
  historyData?: number[];
  onPress?: () => void;
}

export function StatCard({
  title,
  value,
  unit,
  category,
  status,
  statusLabel,
  icon: Icon,
  historyData,
  onPress,
}: StatCardProps) {
  let bgColorClass = 'bg-surfaceMuted';
  let iconColor = '#6B6B76';

  switch (category) {
    case 'turbidity':
      bgColorClass = 'bg-coralMuted';
      iconColor = '#D95D48';
      break;
    case 'ph':
      bgColorClass = 'bg-mintMuted';
      iconColor = '#2E8B73';
      break;
    case 'tds':
      bgColorClass = 'bg-peachMuted';
      iconColor = '#C87A28';
      break;
    case 'general':
      bgColorClass = 'bg-periwinkleMuted';
      iconColor = '#584DB2';
      break;
  }

  return (
    <Card onPress={onPress} className="flex-1 min-w-[150px] m-2">
      <View className="flex-row justify-between items-start mb-4">
        <View className={`p-2 rounded-2xl ${bgColorClass}`}>
          <Icon size={24} color={iconColor} />
        </View>
        {status && statusLabel && <Badge label={statusLabel} status={status} />}
      </View>

      <Typography variant="caption" color="inkMuted" className="uppercase tracking-wider mb-1">
        {title}
      </Typography>

      <View className="flex-row items-baseline mb-4">
        <Typography variant="h1" color="ink" className="mr-1">
          {value}
        </Typography>
        {unit && (
          <Typography variant="body" color="inkMuted">
            {unit}
          </Typography>
        )}
      </View>

      <View className="h-10 mt-auto">
        {historyData && historyData.length > 0 && (
          <Sparkline data={historyData} color={iconColor} />
        )}
      </View>
    </Card>
  );
}
