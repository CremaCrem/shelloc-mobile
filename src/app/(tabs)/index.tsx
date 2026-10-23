import React, { useState } from 'react';
import { View, ScrollView, Pressable, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  Settings,
  Info,
  Cpu,
  Clock,
  ShieldCheck,
  Users,
  Activity,
  MapPin,
  Radio,
  Zap,
  ChevronRight,
  Droplet,
  FlaskConical,
  Waves,
  Thermometer,
} from 'lucide-react-native';
import { Typography } from '@/components/core/Typography';
import { Card } from '@/components/core/Card';
import { Badge, type BadgeStatus } from '@/components/core/Badge';
import { Button } from '@/components/core/Button';
import { StatusHeader, type ConnectionStatus } from '@/components/core/StatusHeader';
import { ProgressRing } from '@/components/domain/ProgressRing';
import { CountdownTimer } from '@/components/domain/CountdownTimer';
import { ReagentGauge } from '@/components/domain/ReagentGauge';
import { StatCard } from '@/components/domain/StatCard';
import { useTelemetry, formatAgo, missionLabel } from '@/hooks/useTelemetry';
import { useWaypoints } from '@/hooks/useWaypoints';
import type { SensorQualityStatus, SensorReading } from '@/types/robot';

const QUALITY_BADGE: Record<SensorQualityStatus, { status: BadgeStatus; label: string }> = {
  good: { status: 'leaf', label: 'GOOD' },
  borderline: { status: 'amber', label: 'BORDERLINE' },
  critical: { status: 'danger', label: 'CRITICAL' },
  no_data: { status: 'neutral', label: 'NO DATA' },
};

type ReadingKey = 'turbidity' | 'ph' | 'tds' | 'temperature';

function readValue(r: SensorReading | undefined, key: ReadingKey): number | undefined {
  if (!r) return undefined;
  switch (key) {
    case 'turbidity': return r.turbidity_ntu ?? r.turbidity;
    case 'ph': return r.ph;
    case 'tds': return r.tds_ppm ?? r.tds;
    case 'temperature': return r.temperature;
  }
}

export default function DashboardScreen() {
  const {
    statusData,
    readings,
    latestReading,
    readingAgeSec,
    lastSeenSec,
    isOnline,
    isLoading,
    operationMode,
    canTakeManualControl,
    refetch,
  } = useTelemetry();
  const { data: waypointsData, refetch: refetchWaypoints } = useWaypoints();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetch(), refetchWaypoints()]);
    } finally {
      setRefreshing(false);
    }
  };

  let connectionState: ConnectionStatus = 'disconnected';
  if (isLoading) connectionState = 'connecting';
  else if (isOnline) connectionState = 'connected';

  const battery = statusData?.battery_percent ?? statusData?.battery_level ?? '--';

  const waypoints = waypointsData ?? [];
  const totalWaypoints = waypoints.length;
  const pointsTreated = waypoints.filter((wp) => wp.treated).length;
  const pointsProgress = totalWaypoints === 0 ? 0 : pointsTreated / totalWaypoints;

  // History for the mini trend lines: oldest → newest.
  const history = (key: ReadingKey) =>
    [...readings].reverse().map((r) => readValue(r, key)).filter((v): v is number => typeof v === 'number');

  const readingPoint = waypoints.find((wp) => wp.id === latestReading?.waypoint_id);
  const readingContext = latestReading
    ? [
        formatAgo(readingAgeSec),
        readingPoint ? `Point ${readingPoint.point_number}` : null,
        latestReading.phase ? `${latestReading.phase} treatment` : null,
      ].filter(Boolean).join(' · ')
    : 'No readings received from the robot yet';
  const quality = latestReading?.status ? QUALITY_BADGE[latestReading.status] : undefined;

  const metric = (key: ReadingKey, digits: number) => {
    const v = readValue(latestReading, key);
    return v === undefined ? undefined : v.toFixed(digits);
  };

  const healthLabel = statusData?.overall_status ? missionLabel(statusData.overall_status) : 'Unknown';
  const healthy = statusData?.overall_status === 'operational';

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
        state={missionLabel(statusData?.mission_state)}
        operationMode={isOnline ? operationMode : undefined}
        batteryPercent={battery}
        gpsSignal={statusData?.gps_signal}
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
                  Bio-Flocculation
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

          {/* 2-Column Bento Grid Row 1: Operation & Points */}
          <View className="flex-row gap-4">
            {/* Operation Card — shows the robot's real mode; tap opens the joystick */}
            <Card
              onPress={canTakeManualControl ? () => router.push('/(modals)/manual-override' as any) : undefined}
              className="flex-1 p-5 border border-surfaceBorder justify-between"
            >
              <View>
                <View className="flex-row items-center justify-between mb-3">
                  <View className="p-2 rounded-xl bg-leafMuted border" style={{ borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                    <Cpu size={20} color="#10B981" />
                  </View>
                  {isOnline && operationMode && (
                    <Badge
                      label={operationMode === 'autonomous' ? 'AUTO' : 'MANUAL'}
                      status={operationMode === 'autonomous' ? 'leaf' : 'amber'}
                      size="sm"
                      showDot={false}
                    />
                  )}
                </View>
                <Typography variant="caption" color="inkMuted" className="uppercase font-semibold tracking-wider">
                  Operation
                </Typography>
                <Typography variant="h3" color="ink" className="mt-1 font-bold">
                  {!isOnline ? 'Unknown' : operationMode === 'manual' ? 'Manual Mode' : operationMode === 'autonomous' ? 'Autonomous' : 'Unknown'}
                </Typography>
                <Typography variant="caption" color="inkSubtle" className="mt-1 capitalize">
                  {isOnline ? missionLabel(statusData?.mission_state) : 'Robot offline'}
                </Typography>
              </View>

              <View className="mt-4 pt-3 border-t border-surfaceBorder flex-row items-center justify-between">
                <Typography variant="caption" color={canTakeManualControl ? 'brand' : 'inkSubtle'} className="font-semibold text-[11px]">
                  {canTakeManualControl ? 'Tap for Manual Control' : isOnline ? 'Busy — treating water' : 'Waiting for robot'}
                </Typography>
                {canTakeManualControl && <ChevronRight size={14} color="#00F2FE" />}
              </View>
            </Card>

            {/* Points Treated Card */}
            <Card className="flex-1 p-5 border border-surfaceBorder justify-between items-center">
              <View className="w-full flex-row items-center justify-between mb-2">
                <Typography variant="caption" color="inkMuted" className="uppercase font-semibold tracking-wider">
                  Points Treated
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
                {totalWaypoints === 0 ? 'No waypoints set' : `${totalWaypoints - pointsTreated} waypoints remaining`}
              </Typography>
            </Card>
          </View>

          {/* Live Water Quality — latest reading the robot sent */}
          <View>
            <View className="flex-row items-center justify-between mb-1">
              <Typography variant="h3" color="ink">
                Live Water Quality
              </Typography>
              {quality && <Badge label={quality.label} status={quality.status} size="sm" showDot={false} />}
            </View>
            <Typography variant="caption" color="inkMuted" className="mb-3 capitalize">
              {readingContext}
            </Typography>
            <View className="flex-row flex-wrap gap-4">
              <StatCard title="Turbidity" category="turbidity" icon={Droplet} value={metric('turbidity', 1)} unit="NTU" historyData={history('turbidity')} />
              <StatCard title="pH" category="ph" icon={FlaskConical} value={metric('ph', 2)} unit="pH" historyData={history('ph')} />
              <StatCard title="TDS" category="tds" icon={Waves} value={metric('tds', 0)} unit="ppm" historyData={history('tds')} />
              <StatCard title="Temperature" category="temperature" icon={Thermometer} value={metric('temperature', 1)} unit="°C" historyData={history('temperature')} />
            </View>
          </View>

          {/* 2-Column Bento Grid Row 2: Last Sync & Robot Health */}
          <View className="flex-row gap-4">
            {/* Last Sync Card */}
            <Card className="flex-1 p-5 border border-surfaceBorder justify-between">
              <View>
                <View className="flex-row items-center justify-between mb-3">
                  <View className="p-2 rounded-xl bg-brandMuted border" style={{ borderColor: 'rgba(0, 242, 254, 0.3)' }}>
                    <Clock size={20} color="#00F2FE" />
                  </View>
                  <View className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-leaf' : 'bg-inkSubtle'}`} />
                </View>
                <Typography variant="caption" color="inkMuted" className="uppercase font-semibold tracking-wider">
                  Last Sync
                </Typography>
                <Typography variant="h3" color="ink" className="mt-1 font-bold">
                  {formatAgo(lastSeenSec)}
                </Typography>
                <Typography variant="caption" color={statusData?.gps_signal === 'good' ? 'leaf' : 'amber'} className="mt-1 font-medium">
                  • GPS: {statusData?.gps_signal ? statusData.gps_signal.toUpperCase() : 'UNKNOWN'}
                </Typography>
              </View>

              <View className="mt-4 pt-3 border-t border-surfaceBorder">
                <Typography variant="caption" color={isOnline ? 'leaf' : 'inkSubtle'} className="text-[11px] font-semibold">
                  {isOnline ? 'Robot online' : 'Robot offline'}
                </Typography>
              </View>
            </Card>

            {/* Robot Health Card — computed by the server from battery & GPS */}
            <Card className="flex-1 p-5 border border-surfaceBorder justify-between">
              <View>
                <View className="flex-row items-center justify-between mb-3">
                  <View className="p-2 rounded-xl bg-leafMuted border" style={{ borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                    <ShieldCheck size={20} color="#10B981" />
                  </View>
                  {statusData?.overall_status && (
                    <Badge label={healthy ? 'OK' : 'CHECK'} status={healthy ? 'leaf' : 'amber'} size="sm" showDot={false} />
                  )}
                </View>
                <Typography variant="caption" color="inkMuted" className="uppercase font-semibold tracking-wider">
                  Robot Health
                </Typography>
                <Typography variant="h3" color="ink" className="mt-1 font-bold capitalize">
                  {healthLabel}
                </Typography>
                <Typography variant="caption" color="inkSubtle" className="mt-1">
                  Battery: {battery}{typeof battery === 'number' ? '%' : ''}
                </Typography>
              </View>

              <View className="mt-4 pt-3 border-t border-surfaceBorder">
                <Typography variant="caption" color="inkSubtle" className="text-[11px]">
                  Based on last report
                </Typography>
              </View>
            </Card>
          </View>

          {/* Reagent Gauge */}
          <ReagentGauge
            moringaPercent={statusData?.flocculant_tank_percent}
            citricAcidPercent={statusData?.citric_acid_tank_percent}
            biocharStatus={statusData?.biochar_health_status}
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
