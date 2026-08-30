import React from 'react';
import { View, Text } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';

interface BuoyancyAlertProps {
  isVisible: boolean;
}

export function BuoyancyAlert({ isVisible }: BuoyancyAlertProps) {
  if (!isVisible) return null;

  return (
    <View className="bg-red-900/30 border border-red-500/50 rounded-xl p-4 flex-row items-center mx-4 my-2">
      <AlertTriangle color="#ef4444" size={24} />
      <View className="ml-3 flex-1">
        <Text className="text-red-400 font-bold text-base">Buoyancy Failsafe Active</Text>
        <Text className="text-red-300/80 text-sm">Ballast pump evacuating to raise antenna for GPS lock.</Text>
      </View>
    </View>
  );
}
