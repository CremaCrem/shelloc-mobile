import React from 'react';
import { View, SafeAreaView } from 'react-native';
import { Typography } from '@/components/core/Typography';

export default function ChatScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-surface">
        <Typography variant="h2" color="ink">AI Assistant</Typography>
      </View>
      <View className="flex-1 items-center justify-center p-6">
        <Typography variant="body" color="inkMuted" className="text-center">
          AI Chat Interface (To be implemented)
        </Typography>
      </View>
    </SafeAreaView>
  );
}
