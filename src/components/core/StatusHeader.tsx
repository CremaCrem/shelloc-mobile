import React from 'react';
import { View } from 'react-native';
import { Cpu, Wifi, WifiOff } from 'lucide-react-native';
import { Typography } from './Typography';

export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting';
export type RobotState = 'idle' | 'cleaning' | 'returning' | 'error';

interface StatusHeaderProps {
  robotName?: string;
  connection: ConnectionStatus;
  state?: RobotState;
}

export function StatusHeader({
  robotName = 'SHELLOC Unit 1',
  connection,
  state = 'idle',
}: StatusHeaderProps) {
  let statusColor = '';
  let Icon = Wifi;

  switch (connection) {
    case 'connected':
      statusColor = 'bg-leaf';
      break;
    case 'connecting':
      statusColor = 'bg-amber';
      break;
    case 'disconnected':
      statusColor = 'bg-inkMuted';
      Icon = WifiOff;
      break;
  }

  // If connected, we might want to show error state in red
  if (connection === 'connected' && state === 'error') {
    statusColor = 'bg-danger';
  }

  return (
    <View className="flex-row items-center justify-between px-6 py-4 bg-surface rounded-b-3xl shadow-sm mb-4">
      <View className="flex-row items-center space-x-3">
        <View className="bg-surfaceMuted p-2 rounded-full">
          <Cpu size={24} color="#111111" />
        </View>
        <View className="flex-col ml-3">
          <Typography variant="h3" color="ink">
            {robotName}
          </Typography>
          <View className="flex-row items-center mt-0.5">
            <View className={`w-2 h-2 rounded-full ${statusColor} mr-1.5`} />
            <Typography variant="caption" color="inkMuted" className="capitalize">
              {connection === 'connected' ? state : connection}
            </Typography>
          </View>
        </View>
      </View>

      <View>
        <Icon size={20} color={connection === 'connected' ? '#5CBB79' : '#6B6B76'} />
      </View>
    </View>
  );
}
