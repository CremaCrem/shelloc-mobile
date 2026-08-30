import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface CountdownTimerProps {
  timerRemainingSec?: number | null;
  isActive: boolean;
}

export function CountdownTimer({ timerRemainingSec, isActive }: CountdownTimerProps) {
  if (!isActive || timerRemainingSec == null) return null;
  
  const minutes = Math.floor(timerRemainingSec / 60);
  const seconds = timerRemainingSec % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  // 15 min = 900 sec
  const progress = timerRemainingSec / 900;
  const radius = 50;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <View className="items-center justify-center p-4">
      <View className="relative items-center justify-center w-32 h-32">
        <Svg width={120} height={120} viewBox="0 0 120 120" className="absolute">
          <Circle
            cx={60}
            cy={60}
            r={radius}
            stroke="#1E293B" // slate-800
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <Circle
            cx={60}
            cy={60}
            r={radius}
            stroke="#00F2FE" // cyan glow
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
          />
        </Svg>
        <Text className="text-3xl font-bold text-white tabular-nums absolute">{timeString}</Text>
        <Text className="text-[10px] text-cyan-400 uppercase font-semibold tracking-wider absolute top-[75px]">Incubating</Text>
      </View>
    </View>
  );
}
