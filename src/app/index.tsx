import React, { useState } from 'react';
import { ScrollView, View, SafeAreaView } from 'react-native';
import { Droplet, Activity, FlaskConical } from 'lucide-react-native';

import { Typography } from '../components/core/Typography';
import { Button } from '../components/core/Button';
import { Card } from '../components/core/Card';
import { Badge } from '../components/core/Badge';
import { StatusHeader } from '../components/core/StatusHeader';
import { StatCard } from '../components/domain/StatCard';
import { ProgressRing } from '../components/domain/ProgressRing';

export default function SandboxScreen() {
  const [progress, setProgress] = useState(0.2);

  // Mock historical data for sparklines
  const mockTurbidity = [15, 14, 18, 12, 11, 9, 8];
  const mockPh = [7.1, 7.2, 7.1, 6.9, 7.0, 7.1];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusHeader connection="connected" state="cleaning" />
      
      <ScrollView className="flex-1 px-4 pb-12">
        <Typography variant="h1" className="mt-4 mb-6">
          Design System Sandbox
        </Typography>

        {/* Buttons */}
        <Typography variant="h2" className="mb-4">Buttons</Typography>
        <View className="space-y-4 mb-8 flex-col gap-4">
          <Button label="Primary Action" variant="primary" onPress={() => setProgress(Math.random())} />
          <Button label="Secondary Action" variant="secondary" />
          <Button label="Outline Button" variant="outline" />
        </View>

        {/* Typography & Badges */}
        <Typography variant="h2" className="mb-4">Typography & Badges</Typography>
        <Card className="mb-8 gap-4 flex-col">
          <Typography variant="h1">Heading 1</Typography>
          <Typography variant="h2">Heading 2</Typography>
          <Typography variant="h3">Heading 3</Typography>
          <Typography variant="body">Body text for general reading.</Typography>
          <Typography variant="caption" color="inkMuted">Caption text for small notes.</Typography>
          
          <View className="flex-row space-x-2 mt-4 gap-2">
            <Badge label="Acceptable" status="leaf" />
            <Badge label="Borderline" status="amber" />
            <Badge label="Critical" status="danger" />
            <Badge label="Offline" status="neutral" />
          </View>
        </Card>

        {/* Stat Cards */}
        <Typography variant="h2" className="mb-4">Telemetry Cards</Typography>
        <View className="flex-row flex-wrap justify-between mb-8">
          <StatCard
            title="Turbidity"
            value="8.4"
            unit="NTU"
            category="turbidity"
            status="leaf"
            statusLabel="Good"
            icon={Droplet}
            historyData={mockTurbidity}
          />
          <StatCard
            title="pH Level"
            value="7.1"
            category="ph"
            status="leaf"
            statusLabel="Stable"
            icon={FlaskConical}
            historyData={mockPh}
          />
          <StatCard
            title="TDS"
            value="450"
            unit="ppm"
            category="tds"
            status="amber"
            statusLabel="Warning"
            icon={Activity}
            historyData={[400, 410, 430, 440, 450]}
          />
        </View>

        {/* Progress Ring */}
        <Typography variant="h2" className="mb-4">Progress Ring (Animated)</Typography>
        <Card className="mb-12 items-center justify-center p-8">
          <ProgressRing progress={progress} color="#5CBB79" size={160} />
          <Typography variant="caption" color="inkMuted" className="mt-4">
            Tap 'Primary Action' to animate
          </Typography>
        </Card>

      </ScrollView>
    </SafeAreaView>
  );
}
