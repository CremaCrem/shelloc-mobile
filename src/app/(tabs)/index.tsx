import React from 'react';
import { View, SafeAreaView, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { Settings } from 'lucide-react-native';
import { Typography } from '@/components/core/Typography';

export default function DashboardScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Custom Header */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-surface">
        <Typography variant="h2" color="ink">Dashboard</Typography>
        <Link href={"/settings" as any} asChild>
          <Pressable className="p-2 -mr-2">
            <Settings size={24} color="#6B6B76" />
          </Pressable>
        </Link>
      </View>

      {/* Body */}
      <View className="flex-1 items-center justify-center p-6">
        <Typography variant="body" color="inkMuted" className="text-center">
          Dashboard Shell Content (To be implemented in Phase 3/4)
        </Typography>
      </View>
    </SafeAreaView>
  );
}
