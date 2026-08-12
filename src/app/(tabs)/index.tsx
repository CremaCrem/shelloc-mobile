import React from 'react';
import { View, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { Settings, Droplet, Activity } from 'lucide-react-native';
import { Typography } from '@/components/core/Typography';
import { Button } from '@/components/core/Button';
import { Card } from '@/components/core/Card';
import { Badge } from '@/components/core/Badge';
import { StatCard } from '@/components/domain/StatCard';
import { ProgressRing } from '@/components/domain/ProgressRing';

export default function DashboardScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Custom Header */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-surface">
        <Typography variant="h2" color="ink">Design Showcase</Typography>
        <Link href={"/settings" as any} asChild>
          <Pressable className="p-2 -mr-2">
            <Settings size={24} color="#6B6B76" />
          </Pressable>
        </Link>
      </View>

      {/* Body */}
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 24 }}>
        <View className="gap-8">
          {/* Typography Section */}
          <View className="gap-2">
            <Typography variant="h3" color="inkMuted" className="mb-2">Typography</Typography>
            <Typography variant="h1">Heading 1</Typography>
            <Typography variant="h2">Heading 2</Typography>
            <Typography variant="h3">Heading 3</Typography>
            <Typography variant="body">Body text - The quick brown fox jumps over the lazy dog.</Typography>
            <Typography variant="label">Label text</Typography>
            <Typography variant="caption" color="inkMuted">Caption text - 12:45 PM</Typography>
          </View>

          {/* Buttons Section */}
          <View className="gap-4">
            <Typography variant="h3" color="inkMuted" className="mb-2">Buttons</Typography>
            <Button label="Primary Button" variant="primary" />
            <Button label="Secondary Button" variant="secondary" />
            <Button label="Outline Button" variant="outline" />
            <Button label="Small Outline" variant="outline" size="small" className="self-start" />
          </View>

          {/* Badges Section */}
          <View className="gap-4">
            <Typography variant="h3" color="inkMuted" className="mb-2">Badges</Typography>
            <View className="flex-row flex-wrap gap-2">
              <Badge label="Optimal" status="leaf" />
              <Badge label="Warning" status="amber" />
              <Badge label="Critical" status="danger" />
              <Badge label="Offline" status="neutral" />
            </View>
          </View>

          {/* Cards Section */}
          <View className="gap-4">
            <Typography variant="h3" color="inkMuted" className="mb-2">Cards</Typography>
            <Card>
              <Typography variant="h3" className="mb-2">Standard Card</Typography>
              <Typography variant="body" color="inkMuted">
                Cards have a white surface, generous border radii, and a soft shadow to elevate them from the background.
              </Typography>
            </Card>
          </View>

          {/* Domain Components Section */}
          <View className="gap-4">
            <Typography variant="h3" color="inkMuted" className="mb-2">Domain Components</Typography>
            
            <View className="flex-row -mx-2">
              <StatCard 
                title="Turbidity" 
                value="4.2" 
                unit="NTU" 
                category="turbidity" 
                status="leaf"
                statusLabel="Good"
                icon={Droplet}
                historyData={[4.5, 4.4, 4.2, 4.1, 4.3, 4.2]}
              />
              <StatCard 
                title="pH Level" 
                value="7.1" 
                category="ph" 
                status="leaf"
                statusLabel="Optimal"
                icon={Activity}
                historyData={[7.0, 7.1, 7.2, 7.1, 7.0, 7.1]}
              />
            </View>

            <Card className="items-center justify-center p-8 mt-2">
              <ProgressRing progress={0.75} color="#5CBB79" />
              <Typography variant="h2" className="mt-4">75%</Typography>
              <Typography variant="caption" color="inkMuted">Battery Level</Typography>
            </Card>
          </View>

          {/* Bottom padding spacer */}
          <View className="h-8" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
