import React from 'react';
import { View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Bot, Wifi, WifiOff, Battery, Radio } from 'lucide-react-native';
import { Typography } from './Typography';
import { Badge, type BadgeStatus } from './Badge';

export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting';
export type RobotState = 'idle' | 'cleaning' | 'navigating' | 'treating' | 'error';

interface StatusHeaderProps {
  robotName?: string;
  connection: ConnectionStatus;
  state?: RobotState;
  operationMode?: 'autonomous' | 'manual';
  batteryPercent?: number | string;
  gpsSignal?: 'good' | 'weak' | 'none';
}

export function StatusHeader({
  robotName = 'SHELLOC-01',
  connection = 'connected',
  state = 'idle',
  operationMode = 'autonomous',
  batteryPercent = 85,
  gpsSignal = 'good',
}: StatusHeaderProps) {
  let connectionBadgeStatus: BadgeStatus = 'neutral';
  let connectionLabel = 'Offline';
  let WifiIcon = WifiOff;
  let wifiColor = '#64748B';

  switch (connection) {
    case 'connected':
      connectionBadgeStatus = 'leaf';
      connectionLabel = 'Online';
      WifiIcon = Wifi;
      wifiColor = '#10B981';
      break;
    case 'connecting':
      connectionBadgeStatus = 'amber';
      connectionLabel = 'Syncing';
      WifiIcon = Radio;
      wifiColor = '#F59E0B';
      break;
    case 'disconnected':
    default:
      connectionBadgeStatus = 'neutral';
      connectionLabel = 'Offline';
      WifiIcon = WifiOff;
      wifiColor = '#64748B';
      break;
  }

  const batteryColor =
    typeof batteryPercent === 'string' || isNaN(Number(batteryPercent))
      ? '#64748B'
      : Number(batteryPercent) > 50
      ? '#10B981'
      : Number(batteryPercent) > 20
      ? '#F59E0B'
      : '#EF4444';

  return (
    <BlurView intensity={80} tint="dark" className="px-6 py-4 border-b border-white/10">
      <View className="flex-row items-center justify-between">
        {/* Left: Robot identity */}
        <View className="flex-row items-center flex-1 mr-2">
          <View className="bg-surfaceElevated border border-surfaceBorder p-2.5 rounded-full mr-3 flex-shrink-0">
            <Bot size={22} color="#00F2FE" />
          </View>
          <View className="flex-shrink">
            <View className="flex-row items-center flex-wrap gap-2 mb-1">
              <Typography variant="h3" color="ink" className="mr-1 flex-shrink">
                {robotName}
              </Typography>
              <Badge
                label={operationMode === 'autonomous' ? 'AUTO' : 'MANUAL'}
                status={operationMode === 'autonomous' ? 'leaf' : 'amber'}
                size="sm"
                showDot={false}
              />
            </View>
            <View className="flex-row items-center mt-1">
              <View
                className={`w-2 h-2 rounded-full mr-1.5 ${
                  connection === 'connected'
                    ? 'bg-leaf'
                    : connection === 'connecting'
                    ? 'bg-amber'
                    : 'bg-inkSubtle'
                }`}
              />
              <Typography variant="caption" color="inkMuted" className="capitalize">
                {connection === 'connected' ? `State: ${state}` : connectionLabel}
              </Typography>
              {gpsSignal && (
                <>
                  <Typography variant="caption" color="inkSubtle" className="mx-1.5">
                    •
                  </Typography>
                  <Typography
                    variant="caption"
                    color={gpsSignal === 'good' ? 'leaf' : 'amber'}
                  >
                    GPS: {gpsSignal.toUpperCase()}
                  </Typography>
                </>
              )}
            </View>
          </View>
        </View>

        {/* Right: Quick telemetry pills */}
        <View className="flex-row items-center gap-2 flex-shrink-0">
          {/* Battery Chip */}
          <View className="flex-row items-center bg-surfaceElevated border border-surfaceBorder px-3 py-1.5 rounded-full">
            <Battery size={16} color={batteryColor} />
            <Typography variant="caption" color="ink" className="ml-1 font-semibold">
              {batteryPercent}{typeof batteryPercent === 'number' ? '%' : ''}
            </Typography>
          </View>

          {/* Connection Chip */}
          <View className="bg-surfaceElevated border border-surfaceBorder p-2 rounded-full">
            <WifiIcon size={16} color={wifiColor} />
          </View>
        </View>
      </View>
    </BlurView>
  );
}
