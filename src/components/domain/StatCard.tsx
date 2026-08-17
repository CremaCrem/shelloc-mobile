import React from 'react';
import { View } from 'react-native';
import { Card } from '../core/Card';
import { Typography } from '../core/Typography';
import { Badge, type BadgeStatus } from '../core/Badge';
import { Sparkline } from './Sparkline';
import { type LucideIcon, ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react-native';

export type StatCategory = 'turbidity' | 'ph' | 'tds' | 'do' | 'temperature' | 'general';

interface ComparativeData {
  beforeValue: string | number;
  afterValue: string | number;
  unit?: string;
  deltaPercent?: number; // e.g. -88.6 for reduction in turbidity
  beforeStatus?: BadgeStatus;
  beforeStatusLabel?: string;
  afterStatus?: BadgeStatus;
  afterStatusLabel?: string;
}

interface StatCardProps {
  title: string;
  category: StatCategory;
  icon: LucideIcon;
  // Single metric mode props
  value?: string | number;
  unit?: string;
  status?: BadgeStatus;
  statusLabel?: string;
  historyData?: number[];
  subtitle?: string;
  // Comparative mode props (for Diagnostics Before/After)
  comparative?: ComparativeData;
  onPress?: () => void;
  className?: string;
}

export function StatCard({
  title,
  category,
  icon: Icon,
  value,
  unit,
  status,
  statusLabel,
  historyData,
  subtitle,
  comparative,
  onPress,
  className = '',
}: StatCardProps) {
  let iconColor = '#00F2FE'; // brand
  let iconBgClass = 'bg-brandMuted border-brand/30';

  switch (category) {
    case 'turbidity':
      iconColor = '#00F2FE';
      iconBgClass = 'bg-brandMuted border-brand/30';
      break;
    case 'ph':
      iconColor = '#10B981';
      iconBgClass = 'bg-leafMuted border-leaf/30';
      break;
    case 'tds':
      iconColor = '#F59E0B';
      iconBgClass = 'bg-amberMuted border-amber/30';
      break;
    case 'do':
      iconColor = '#38BDF8';
      iconBgClass = 'bg-sky/15 border-sky/30';
      break;
    case 'temperature':
      iconColor = '#F97316';
      iconBgClass = 'bg-orange-500/15 border-orange-500/30';
      break;
    case 'general':
    default:
      iconColor = '#00F2FE';
      iconBgClass = 'bg-brandMuted border-brand/30';
      break;
  }

  // Render Comparative Mode (Diagnostics Wireframe)
  if (comparative) {
    const {
      beforeValue,
      afterValue,
      unit: compUnit = '',
      deltaPercent,
      beforeStatus = 'danger',
      beforeStatusLabel = 'Untreated',
      afterStatus = 'leaf',
      afterStatusLabel = 'Remediated',
    } = comparative;

    const isReductionGood = category === 'turbidity' || category === 'tds';
    const isImproved =
      deltaPercent !== undefined
        ? isReductionGood
          ? deltaPercent < 0
          : deltaPercent > 0
        : true;

    return (
      <Card onPress={onPress} className={`p-5 mb-4 ${className}`}>
        {/* Header: Icon + Metric Title + Category */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <View
              className={`p-2.5 rounded-2xl border ${iconBgClass} mr-3 items-center justify-center`}
            >
              <Icon size={20} color={iconColor} />
            </View>
            <View>
              <Typography variant="h3" color="ink">
                {title}
              </Typography>
              <Typography variant="caption" color="inkSubtle">
                {subtitle || 'Treatment Efficiency Comparison'}
              </Typography>
            </View>
          </View>

          {deltaPercent !== undefined && (
            <View
              className={`flex-row items-center px-2.5 py-1 rounded-full border ${
                isImproved
                  ? 'bg-leafMuted border-leaf/40'
                  : 'bg-dangerMuted border-danger/40'
              }`}
            >
              {deltaPercent < 0 ? (
                <ArrowDownRight size={14} color={isImproved ? '#10B981' : '#EF4444'} />
              ) : deltaPercent > 0 ? (
                <ArrowUpRight size={14} color={isImproved ? '#10B981' : '#EF4444'} />
              ) : (
                <Minus size={14} color="#94A3B8" />
              )}
              <Typography
                variant="caption"
                color={isImproved ? 'leaf' : 'danger'}
                className="font-bold ml-0.5"
              >
                {Math.abs(deltaPercent).toFixed(1)}%
              </Typography>
            </View>
          )}
        </View>

        {/* Side-by-Side Comparison Container */}
        <View className="flex-row gap-3">
          {/* Before Treatment Column */}
          <View className="flex-1 bg-surfaceElevated border border-surfaceBorder rounded-2xl p-3.5">
            <View className="flex-row items-center justify-between mb-2">
              <Typography variant="caption" color="inkSubtle" className="uppercase font-semibold">
                Before
              </Typography>
              <Badge label={beforeStatusLabel} status={beforeStatus} size="sm" />
            </View>
            <View className="flex-row items-baseline">
              <Typography variant="h2" color="ink" className="mr-1">
                {beforeValue}
              </Typography>
              {compUnit && (
                <Typography variant="caption" color="inkMuted">
                  {compUnit}
                </Typography>
              )}
            </View>
          </View>

          {/* After Treatment Column */}
          <View className="flex-1 bg-surfaceElevated border border-brand/40 rounded-2xl p-3.5">
            <View className="flex-row items-center justify-between mb-2">
              <Typography variant="caption" color="brand" className="uppercase font-semibold">
                After
              </Typography>
              <Badge label={afterStatusLabel} status={afterStatus} size="sm" />
            </View>
            <View className="flex-row items-baseline">
              <Typography variant="h2" color="brand" className="mr-1 font-bold">
                {afterValue}
              </Typography>
              {compUnit && (
                <Typography variant="caption" color="brand">
                  {compUnit}
                </Typography>
              )}
            </View>
          </View>
        </View>
      </Card>
    );
  }

  // Render Single Metric Mode (Home Live Telemetry)
  return (
    <Card onPress={onPress} className={`flex-1 min-w-[150px] p-5 ${className}`}>
      <View className="flex-row justify-between items-start mb-3">
        <View
          className={`p-2.5 rounded-2xl border ${iconBgClass} items-center justify-center`}
        >
          <Icon size={20} color={iconColor} />
        </View>
        {status && statusLabel && <Badge label={statusLabel} status={status} />}
      </View>

      <Typography
        variant="caption"
        color="inkMuted"
        className="uppercase tracking-wider font-semibold mb-1"
      >
        {title}
      </Typography>

      <View className="flex-row items-baseline mb-2">
        <Typography variant="h1" color="ink" className="mr-1 font-bold">
          {value ?? '--'}
        </Typography>
        {unit && (
          <Typography variant="body" color="inkMuted">
            {unit}
          </Typography>
        )}
      </View>

      {subtitle && (
        <Typography variant="caption" color="inkSubtle" className="mb-2">
          {subtitle}
        </Typography>
      )}

      {historyData && historyData.length > 0 && (
        <View className="h-10 mt-auto pt-2">
          <Sparkline data={historyData} color={iconColor} strokeWidth={2.5} />
        </View>
      )}
    </Card>
  );
}
