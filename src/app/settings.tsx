import React from 'react';
import { View, SafeAreaView } from 'react-native';
import { Typography } from '@/components/core/Typography';
import { StatusBar } from 'expo-status-bar';

export default function SettingsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="flex-1 items-center justify-center p-6">
        <Typography variant="h2" color="ink" className="mb-2 text-center">
          Robot Pairing & Settings
        </Typography>
        <Typography variant="body" color="inkMuted" className="text-center">
          Connection flow and app settings will be built here.
        </Typography>
      </View>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}
