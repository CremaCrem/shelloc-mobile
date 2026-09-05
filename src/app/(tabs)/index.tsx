import React, { useState } from 'react';
import { View, ScrollView, Pressable, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  Settings,
  Info,
  Cpu,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Users,
  Activity,
  MapPin,
  Radio,
  Zap,
  ChevronRight,
  Droplet,
} from 'lucide-react-native';
import { Typography } from '@/components/core/Typography';
import { Card } from '@/components/core/Card';
import { Badge } from '@/components/core/Badge';
import { Button } from '@/components/core/Button';
import { StatusHeader, type ConnectionStatus, type RobotState } from '@/components/core/StatusHeader';
import { ProgressRing } from '@/components/domain/ProgressRing';
import { CountdownTimer } from '@/components/domain/CountdownTimer';
import { ReagentGauge } from '@/components/domain/ReagentGauge';
import { useTelemetry } from '@/hooks/useTelemetry';
import { useAppStore } from '@/store/useAppStore';

export default function DashboardScreen() {
  const { sensorData, statusData, isLoading, isError } = useTelemetry();
  const isDemoMode = useAppStore((state) => state.isDemoMode);
  const [operationMode, setOperationMode] = useState<'autonomous' | 'manual'>('autonomous');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  let connectionState: ConnectionStatus = 'disconnected';
  if (isLoading) connectionState = 'connecting';
  else if (!isError && statusData) connectionState = 'connected';

  const robotState: RobotState = statusData?.is_active
    ? statusData.current_action?.toLowerCase().includes('error')
      ? 'error'
      : 'cleaning'
    : 'idle';

  const battery = statusData?.battery_percent ?? statusData?.battery_level ?? (isDemoMode && connectionState === 'connected' ? 86 : '--');
  const pointsTreated = statusData?.points_treated_today ?? (isDemoMode && connectionState === 'connected' ? 4 : '--');
  const totalWaypoints = 6;
  const pointsProgress = pointsTreated === '--' ? 0 : (pointsTreated as number) / totalWaypoints;

  const toggleMode = () => {
    setOperationMode((prev) => (prev === 'autonomous' ? 'manual' : 'autonomous'));
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Top App Header */}
      <View className="flex-row items-center justify-between px-6 py-3.5 bg-surface border-b border-surfaceBorder">
        <View className="flex-row items-center space-x-2">
          <View className="w-8 h-8 rounded-xl bg-brand items-center justify-center mr-2 shadow-sm shadow-brand/30">
            <Droplet size={18} color="#0B111E" />
          </View>
          <View>
            <Typography variant="h2" color="ink" className="font-extrabold tracking-wider">
              SHELLOC
            </Typography>
            <Typography variant="caption" color="brand" className="font-medium text-[10px]">
              AUTONOMOUS REMEDIATION ROBOT
            </Typography>
          </View>
        </View>

        <Pressable
          onPress={() => router.push('/settings')}
          className="p-2.5 rounded-2xl bg-surfaceElevated border border-surfaceBorder active:opacity-70"
          accessibilityRole="button"
          accessibilityLabel="Open settings"
        >
          <Settings size={20} color="#94A3B8" />
        </Pressable>
      </View>

      {/* Connection & Telemetry Status Header */}
      <StatusHeader
        robotName={statusData?.robot_id || 'SHELLOC-01'}
        connection={connectionState}
        state={robotState}
        operationMode={operationMode}
        batteryPercent={battery}
        gpsSignal={statusData?.gps_signal || 'good'}
      />

      {/* Main Bento Grid Content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00F2FE" />
        }
      >
        <View className="space-y-4 gap-4">
          
          {/* 1. About Card */}
          <Card className="p-5 border border-surfaceBorder bg-surface">
            <View className="flex-row items-start justify-between mb-3">
              <View className="flex-row items-center">
                <View className="p-2 rounded-xl bg-brandMuted border border-brand/30 mr-3">
                  <Info size={20} color="#00F2FE" />
                </View>
                <Typography variant="h3" color="ink">
                  About SHELLOC
                </Typography>
              </View>
              <Badge label="BIO-CLEANER" status="brand" size="sm" showDot={false} />
            </View>

            <Typography variant="body" color="inkMuted" className="text-sm leading-relaxed mb-3">
              <Typography variant="body" color="brand" className="text-sm font-semibold">
                Smart Hydro-Environmental Locator and Cleaner
              </Typography>{' '}
              is an autonomous robotic vessel deploying natural{' '}
              <Typography variant="body" color="ink" className="text-sm font-medium">
                Moringa-Chitosan flocculant
              </Typography>{' '}
              to eliminate suspended particulate matter and restore open water ecosystems.
            </Typography>

            <View className="flex-row items-center pt-2 border-t border-surfaceBorder flex-wrap gap-3">
              <View className="flex-row items-center flex-shrink-0">
                <Zap size={14} color="#10B981" />
                <Typography variant="caption" color="inkSubtle" className="ml-1 font-medium">
                  Bio-Flocculation Active
                </Typography>
              </View>
              <View className="flex-row items-center flex-shrink-0">
                <Radio size={14} color="#00F2FE" />
                <Typography variant="caption" color="inkSubtle" className="ml-1 font-medium">
                  2m Geofence Autonomy
                </Typography>
              </View>
            </View>
          </Card>

          {/* 2-Column Bento Grid Row 1: Operation & Points Today */}
          <View className="flex-row gap-4">
            {/* Operation Card */}
            <Card
              onPress={toggleMode}
              className="flex-1 p-5 border border-surfaceBorder justify-between"
            >
              <View>
                <View className="flex-row items-center justify-between mb-3">
                  <View className="p-2 rounded-xl bg-leafMuted border" style={{ borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                    <Cpu size={20} color="#10B981" />
                  </View>
                  <Badge
                    label={operationMode === 'autonomous' ? 'AUTO' : 'MANUAL'}
                    status={operationMode === 'autonomous' ? 'leaf' : 'amber'}
                    size="sm"
                    showDot={false}
                  />
                </View>
                <Typography variant="caption" color="inkMuted" className="uppercase font-semibold tracking-wider">
                  Operation
                </Typography>
                <Typography variant="h3" color="ink" className="mt-1 font-bold">
                  {operationMode === 'autonomous' ? 'Autonomous' : 'Manual Mode'}
                </Typography>
                <Typography variant="caption" color="inkSubtle" className="mt-1">
                  {operationMode === 'autonomous' ? 'Self-navigating GPS route' : 'Joystick override active'}
                </Typography>
              </View>

              <View className="mt-4 pt-3 border-t border-surfaceBorder flex-row items-center justify-between">
                <Typography variant="caption" color="brand" className="font-semibold text-[11px]">
                  Tap to Switch
                </Typography>
                <ChevronRight size={14} color="#00F2FE" />
              </View>
            </Card>

            {/* Points Today Card */}
            <Card className="flex-1 p-5 border border-surfaceBorder justify-between items-center">
              <View className="w-full flex-row items-center justify-between mb-2">
                <Typography variant="caption" color="inkMuted" className="uppercase font-semibold tracking-wider">
                  Points Today
                </Typography>
                <Badge label="MISSION" status="neutral" size="sm" showDot={false} />
              </View>

              <View className="my-2 items-center justify-center">
                <ProgressRing
                  progress={pointsProgress}
                  size={90}
                  strokeWidth={9}
                  color="#00F2FE"
                  backgroundColor="#1E293B"
                />
                <View className="absolute items-center justify-center">
                  <Typography variant="h2" color="ink" className="font-bold">
                    {pointsTreated}
                    <Typography variant="caption" color="inkMuted">
                      /{totalWaypoints}
                    </Typography>
                  </Typography>
                </View>
              </View>

              <Typography variant="caption" color="inkSubtle" className="text-center mt-1">
                {typeof pointsTreated === 'number' ? totalWaypoints - pointsTreated : '--'} waypoints remaining
              </Typography>
            </Card>
          </View>

          {/* 2-Column Bento Grid Row 2: Last Sync & App Readiness */}
          <View className="flex-row gap-4">
            {/* Last Sync Card */}
            <Card className="flex-1 p-5 border border-surfaceBorder justify-between">
              <View>
                <View className="flex-row items-center justify-between mb-3">
                  <View className="p-2 rounded-xl bg-brandMuted border" style={{ borderColor: 'rgba(0, 242, 254, 0.3)' }}>
                    <Clock size={20} color="#00F2FE" />
                  </View>
                  <View className="w-2.5 h-2.5 rounded-full bg-leaf animate-pulse" />
                </View>
                <Typography variant="caption" color="inkMuted" className="uppercase font-semibold tracking-wider">
                  Last Sync
                </Typography>
                <Typography variant="h3" color="ink" className="mt-1 font-bold">
                  Just now
                </Typography>
                <Typography variant="caption" color="leaf" className="mt-1 font-medium">
                  • 12 Satellites Locked
                </Typography>
              </View>

              <View className="mt-4 pt-3 border-t border-surfaceBorder">
                <Typography variant="caption" color="inkSubtle" className="text-[11px]">
                  Heartbeat: 5.0s interval
                </Typography>
              </View>
            </Card>

            {/* App Readiness Card */}
            <Card className="flex-1 p-5 border border-surfaceBorder justify-between">
              <View>
                <View className="flex-row items-center justify-between mb-3">
                  <View className="p-2 rounded-xl bg-leafMuted border" style={{ borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                    <ShieldCheck size={20} color="#10B981" />
                  </View>
                  <Badge label="READY" status="leaf" size="sm" showDot={false} />
                </View>
                <Typography variant="caption" color="inkMuted" className="uppercase font-semibold tracking-wider">
                  App Readiness
                </Typography>
                <Typography variant="h3" color="ink" className="mt-1 font-bold">
                  Operational
                </Typography>
                <Typography variant="caption" color="inkSubtle" className="mt-1">
                  All systems calibrated
                </Typography>
              </View>

              <View className="mt-4 pt-3 border-t border-surfaceBorder flex-row items-center">
                <CheckCircle2 size={12} color="#10B981" />
                <Typography variant="caption" color="leaf" className="ml-1 text-[11px] font-semibold">
                  100% Sensors Online
                </Typography>
              </View>
            </Card>
          </View>

          {/* Reagent Gauge */}
          <ReagentGauge
            moringaPercent={statusData?.flocculant_tank_percent ?? 85}
            citricAcidPercent={statusData?.citric_acid_tank_percent ?? 92}
            biocharStatus={statusData?.biochar_health_status ?? 'optimal'}
          />

          {/* Incubation Countdown */}
          {statusData?.mission_state === 'incubating_15m' && (
            <CountdownTimer
              timerRemainingSec={statusData.timer_remaining_sec}
              isActive={true}
            />
          )}

          {/* 5. Proponents Card */}
          <Card className="p-5 border border-surfaceBorder bg-surface">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <View className="p-2 rounded-xl bg-surfaceElevated border border-surfaceBorder mr-3">
                  <Users size={20} color="#94A3B8" />
                </View>
                <Typography variant="h3" color="ink">
                  Proponents & Research Team
                </Typography>
              </View>
            </View>

            <Typography variant="body" color="inkMuted" className="text-sm leading-relaxed mb-3">
              Developed by the{' '}
              <Typography variant="body" color="ink" className="text-sm font-semibold">
                SHELLOC Research Team
              </Typography>{' '}
              for precision freshwater monitoring and micro-flocculation remediation.
            </Typography>

            <View className="bg-surfaceElevated p-3 rounded-2xl border border-surfaceBorder flex-row items-center justify-between">
              <View className="flex-1 mr-2">
                <Typography variant="caption" color="inkSubtle" className="font-semibold uppercase text-[10px]">
                  Project Lead & Research
                </Typography>
                <Typography variant="body" color="ink" className="text-xs font-medium mt-0.5">
                  SHELLOC Environmental Engineering Team
                </Typography>
              </View>
              <Badge label="v1.0.0" status="neutral" size="sm" showDot={false} />
            </View>
          </Card>

          {/* Quick Action Navigation Bar */}
          <View className="space-y-3 gap-3 pt-2">
            <Button
              label="Launch Live Diagnostics & Telemetry"
              variant="primary"
              size="large"
              icon={Activity}
              onPress={() => router.push('/(tabs)/diagnostics' as any)}
            />

            <Button
              label="Setup Waypoint Mission"
              variant="secondary"
              size="large"
              icon={MapPin}
              onPress={() => router.push('/(modals)/waypoint-setup' as any)}
            />
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
