import React, { useState } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface SparklineProps {
  data: number[];
  color?: string;
  strokeWidth?: number;
}

export function Sparkline({ data, color = '#4F91D6', strokeWidth = 2 }: SparklineProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setDimensions({ width, height });
  };

  if (!data || data.length < 2) return <View className="flex-1" onLayout={onLayout} />;

  const { width, height } = dimensions;

  if (width === 0 || height === 0) return <View className="flex-1" onLayout={onLayout} />;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min === 0 ? 1 : max - min; // avoid division by zero

  // Generate SVG path 'd' string
  const pathParts = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    // Invert Y axis because SVG 0,0 is top-left
    const y = height - ((value - min) / range) * height;
    
    // add some padding for the stroke
    const adjustedY = Math.max(strokeWidth, Math.min(height - strokeWidth, y));
    
    return `${index === 0 ? 'M' : 'L'} ${x},${adjustedY}`;
  });

  const d = pathParts.join(' ');

  return (
    <View className="flex-1" onLayout={onLayout}>
      <Svg height="100%" width="100%" viewBox={`0 0 ${width} ${height}`}>
        <Path d={d} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </View>
  );
}
