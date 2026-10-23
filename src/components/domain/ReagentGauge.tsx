import React from 'react';
import { View, Text } from 'react-native';

interface ReagentGaugeProps {
  moringaPercent?: number;
  citricAcidPercent?: number;
  biocharStatus?: 'optimal' | 'degraded' | 'replace';
}

// Missing values show "--" with an empty bar: the robot hasn't reported them.
export function ReagentGauge({ moringaPercent, citricAcidPercent, biocharStatus }: ReagentGaugeProps) {
  const getBiocharColor = () => {
    switch(biocharStatus) {
      case 'optimal': return 'bg-emerald-500';
      case 'degraded': return 'bg-amber-500';
      case 'replace': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  const noData = moringaPercent === undefined && citricAcidPercent === undefined && biocharStatus === undefined;

  return (
    <View className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/50">
      <Text className="text-white font-semibold text-lg mb-1">Consumables</Text>
      <Text className="text-slate-400 text-xs mb-4">
        {noData ? 'Not reported by the robot yet' : 'Reported by the robot'}
      </Text>

      {/* Moringa */}
      <View className="mb-3">
        <View className="flex-row justify-between mb-1">
          <Text className="text-slate-300 text-sm">Moringa-Chitosan</Text>
          <Text className="text-cyan-400 text-sm font-medium">
            {moringaPercent === undefined ? '--' : `${moringaPercent}%`}
          </Text>
        </View>
        <View className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <View
            className={`h-full ${(moringaPercent ?? 0) < 20 ? 'bg-red-500' : 'bg-cyan-500'}`}
            style={{ width: `${moringaPercent ?? 0}%` }}
          />
        </View>
      </View>

      {/* Citric Acid */}
      <View className="mb-4">
        <View className="flex-row justify-between mb-1">
          <Text className="text-slate-300 text-sm">Citric Acid</Text>
          <Text className="text-amber-400 text-sm font-medium">
            {citricAcidPercent === undefined ? '--' : `${citricAcidPercent}%`}
          </Text>
        </View>
        <View className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <View
            className={`h-full ${(citricAcidPercent ?? 0) < 15 ? 'bg-red-500' : 'bg-amber-500'}`}
            style={{ width: `${citricAcidPercent ?? 0}%` }}
          />
        </View>
      </View>

      {/* Biochar */}
      <View className="flex-row items-center justify-between border-t border-slate-700 pt-3">
        <Text className="text-slate-300 text-sm">Biochar Filter</Text>
        <View className="flex-row items-center space-x-2">
          <View className={`w-2 h-2 rounded-full ${getBiocharColor()}`} />
          <Text className="text-white text-sm capitalize">{biocharStatus ?? '--'}</Text>
        </View>
      </View>
    </View>
  );
}
