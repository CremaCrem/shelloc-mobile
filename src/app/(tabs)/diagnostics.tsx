import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Pressable,
  RefreshControl,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import MapView, { Marker, Circle } from 'react-native-maps';
import { DARK_MAP_STYLE } from '@/constants/mapStyle';
import {
  Activity,
  Droplet,
  FlaskConical,
  Wind,
  Navigation,
  Radio,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sliders,
  Maximize2,
} from 'lucide-react-native';
import { Typography } from '@/components/core/Typography';
import { Card } from '@/components/core/Card';
import { Badge } from '@/components/core/Badge';
import { Button } from '@/components/core/Button';
import { StatusHeader } from '@/components/core/StatusHeader';
import { StatCard } from '@/components/domain/StatCard';
import { useTelemetry } from '@/hooks/useTelemetry';
import { useWaypoints } from '@/hooks/useWaypoints';
import { useDispatchRobot } from '@/hooks/useDispatch';

export default function DiagnosticsScreen() {
  const { sensorData, statusData, isLoading, isError } = useTelemetry();
  const { data: waypointsData } = useWaypoints();
  const dispatchRobot = useDispatchRobot();
  
  const waypoints = waypointsData || [];
  const [selectedPointIndex, setSelectedPointIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const selectedWaypoint = waypoints[selectedPointIndex] || null;

  // Helper to extract comparative data
  const getComparativeData = (key: 'turbidity_ntu' | 'ph' | 'dissolved_oxygen', baseline: number) => {
    if (!selectedWaypoint) return { before: baseline, after: baseline, delta: 0 };
    
    const before = selectedWaypoint.before_reading?.[key] ?? baseline;
    const after = selectedWaypoint.after_reading?.[key] ?? before;
    const delta = before > 0 ? ((after - before) / before) * 100 : 0;
    
    return { before, after, delta };
  };

  const turbidityData = getComparativeData('turbidity_ntu', 124.5);
  const phData = getComparativeData('ph', 5.2);
  const doData = getComparativeData('dissolved_oxygen', 3.8);

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Screen Title Bar */}
      <View className="flex-row items-center justify-between px-6 py-3.5 bg-surface border-b border-surfaceBorder">
        <View className="flex-row items-center">
          <View className="p-2 rounded-xl bg-brandMuted border border-brand/30 mr-3">
            <Activity size={20} color="#00F2FE" />
          </View>
          <View>
            <Typography variant="h2" color="ink" className="font-bold">
              Live Diagnostics
            </Typography>
            <Typography variant="caption" color="inkMuted">
              REAL-TIME SENSOR TELEMETRY & FLOC ANALYSIS
            </Typography>
          </View>
        </View>

        <Pressable
          onPress={() => router.push('/(modals)/waypoint-setup' as any)}
          className="p-2.5 rounded-2xl bg-surfaceElevated border border-surfaceBorder active:opacity-70"
          accessibilityRole="button"
          accessibilityLabel="Waypoint mission setup"
        >
          <Sliders size={18} color="#00F2FE" />
        </Pressable>
      </View>

      {/* Global Status Bar */}
      <StatusHeader
        robotName={statusData?.robot_id || 'SHELLOC-01'}
        connection={isError ? 'disconnected' : isLoading ? 'connecting' : 'connected'}
        state={statusData?.is_active ? 'cleaning' : 'idle'}
        operationMode="autonomous"
        batteryPercent={statusData?.battery_percent ?? 86}
        gpsSignal="good"
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00F2FE" />
        }
      >
        <View className="space-y-5 gap-5">
          {/* 1. Map Overview with Numbered Waypoints */}
          <Card className="p-0 overflow-hidden border border-surfaceBorder bg-surface">
            {/* Map Header Overlay */}
            <View className="p-4 bg-surface/90 border-b border-surfaceBorder flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Radio size={16} color="#00F2FE" className="mr-2" />
                <Typography variant="h3" color="ink" className="text-base font-semibold">
                  Autonomous Waypoint Radar
                </Typography>
              </View>
              <Badge label="GEOFENCE: 2.0M" status="neutral" size="sm" showDot={false} />
            </View>

            {/* Real Interactive Map Canvas */}
            <View className="h-64 relative overflow-hidden">
              <MapView
                style={StyleSheet.absoluteFill}
                initialRegion={{
                  latitude: 14.60012,
                  longitude: 120.98565,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                }}
                customMapStyle={DARK_MAP_STYLE}
                pitchEnabled={false}
              >
                {waypoints.map((wp, idx) => {
                  const isSelected = selectedPointIndex === idx;
                  const isTreated = wp.treated;
                  
                  return (
                    <React.Fragment key={wp.id}>
                      {/* 2-Meter Boundary Circle */}
                      <Circle
                        center={{ latitude: wp.latitude, longitude: wp.longitude }}
                        radius={20}
                        fillColor={isTreated ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)"}
                        strokeColor={isTreated ? "rgba(16, 185, 129, 0.4)" : "rgba(245, 158, 11, 0.4)"}
                        strokeWidth={1}
                      />
                      
                      {/* Waypoint Marker */}
                      <Marker
                        coordinate={{ latitude: wp.latitude, longitude: wp.longitude }}
                        onPress={() => setSelectedPointIndex(idx)}
                        anchor={{ x: 0.5, y: 0.5 }}
                      >
                        <View className={`w-8 h-8 rounded-full items-center justify-center border ${
                          isSelected
                            ? 'bg-brand border-brand shadow-lg shadow-brand'
                            : isTreated
                            ? 'bg-leafMuted border-leaf'
                            : 'bg-surfaceElevated border-amber/60'
                        }`}>
                          <Typography
                            variant="caption"
                            color={isSelected ? 'dark' : isTreated ? 'leaf' : 'amber'}
                            className="font-bold text-[11px]"
                          >
                            P{wp.point_number}
                          </Typography>
                        </View>
                      </Marker>
                    </React.Fragment>
                  );
                })}

                {/* Robot Current Position Marker */}
                <Marker
                  coordinate={{ 
                    latitude: statusData?.current_lat ?? 14.59972, 
                    longitude: statusData?.current_lng ?? 120.98491 
                  }}
                  anchor={{ x: 0.5, y: 0.5 }}
                  zIndex={10}
                >
                  <View className="items-center justify-center">
                    <View className="w-8 h-8 rounded-full bg-brand/20 border border-brand animate-ping absolute" />
                    <View className="w-6 h-6 rounded-full bg-brand items-center justify-center shadow-md shadow-brand">
                      <Navigation size={12} color="#0B111E" />
                    </View>
                  </View>
                </Marker>
              </MapView>

              {/* Coordinate HUD Readout */}
              <View className="absolute bottom-2 left-3 bg-surface/85 px-2.5 py-1 rounded-lg border border-surfaceBorder" pointerEvents="none">
                <Typography variant="caption" color="inkMuted" className="font-mono text-[10px]">
                  Vessel: {(statusData?.current_lat ?? 14.59972).toFixed(5)}° N, {(statusData?.current_lng ?? 120.98491).toFixed(5)}° E
                </Typography>
              </View>
            </View>

            {/* 2. Status Legend Bar */}
            <View className="p-3 bg-surfaceElevated border-t border-surfaceBorder flex-row items-center justify-around">
              <View className="flex-row items-center">
                <View className="w-2 h-2 rounded-full bg-leaf mr-1.5" />
                <Typography variant="caption" color="inkMuted" className="text-[11px] font-medium">
                  GPS: Good
                </Typography>
              </View>

              <View className="flex-row items-center">
                <View className="w-2 h-2 rounded-full bg-brand mr-1.5" />
                <Typography variant="caption" color="inkMuted" className="text-[11px] font-medium">
                  Mode: Auto
                </Typography>
              </View>

              <View className="flex-row items-center">
                <View className="w-2 h-2 rounded-full bg-leaf mr-1.5" />
                <Typography variant="caption" color="inkMuted" className="text-[11px] font-medium">
                  Battery: {statusData?.battery_percent ?? 86}%
                </Typography>
              </View>

              <View className="flex-row items-center">
                <View className="w-2 h-2 rounded-full bg-leaf mr-1.5" />
                <Typography variant="caption" color="inkMuted" className="text-[11px] font-medium">
                  Floc: Ready
                </Typography>
              </View>
            </View>
          </Card>

          {/* 3. Waypoint Selector Chips */}
          <View>
            <Typography variant="caption" color="inkMuted" className="uppercase font-semibold tracking-wider mb-2">
              Select Waypoint Telemetry Target
            </Typography>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row -mx-1">
              {waypoints.map((wp, idx) => {
                const isSelected = selectedPointIndex === idx;
                return (
                  <Pressable
                    key={wp.id}
                    onPress={() => setSelectedPointIndex(idx)}
                    className={`mx-1.5 px-4 py-2.5 rounded-2xl border flex-row items-center ${
                      isSelected
                        ? 'bg-brand border-brand shadow-sm shadow-brand/30'
                        : wp.treated
                        ? 'bg-surface border-surfaceBorder'
                        : 'bg-surfaceElevated border-surfaceBorder'
                    }`}
                  >
                    <Typography
                      variant="label"
                      color={isSelected ? 'dark' : 'ink'}
                      className="font-bold mr-1.5"
                    >
                      Point {wp.point_number}
                    </Typography>
                    {wp.treated ? (
                      <CheckCircle2 size={14} color={isSelected ? '#0B111E' : '#10B981'} />
                    ) : (
                      <Badge
                        label="PENDING"
                        status="amber"
                        size="sm"
                        showDot={false}
                        className={isSelected ? 'bg-black/20' : ''}
                      />
                    )}
                  </Pressable>
                );
              })}
              {waypoints.length === 0 && (
                <Typography variant="caption" color="inkMuted" className="italic px-2">
                  No active waypoints. Please configure mission.
                </Typography>
              )}
            </ScrollView>
          </View>

          {/* 4. Selected Waypoint Header Banner */}
          {selectedWaypoint && (
            <View className="flex-row items-center justify-between pt-1">
              <View>
                <Typography variant="h2" color="ink" className="font-bold">
                  {selectedWaypoint.label} Latest Data
                </Typography>
                <Typography variant="caption" color="inkMuted" className="font-mono">
                  {selectedWaypoint.latitude.toFixed(6)}° N, {selectedWaypoint.longitude.toFixed(6)}° E
                </Typography>
              </View>

              <Badge
                label={selectedWaypoint.treated ? 'REMEDIATED' : 'UNTREATED'}
                status={selectedWaypoint.treated ? 'leaf' : 'amber'}
                size="md"
              />
            </View>
          )}

          {/* 5. Comparative Telemetry Cards (Before vs After) */}
          <View className="space-y-4 gap-4">
            {/* Turbidity Comparative Card */}
            <StatCard
              title="Turbidity Index"
              subtitle="Suspended Solids Aggregation (NTU)"
              category="turbidity"
              icon={Droplet}
              comparative={{
                beforeValue: turbidityData.before.toFixed(1),
                afterValue: turbidityData.after.toFixed(1),
                unit: 'NTU',
                deltaPercent: turbidityData.delta,
                beforeStatus: 'danger',
                beforeStatusLabel: `Critical (${turbidityData.before.toFixed(1)})`,
                afterStatus: selectedWaypoint?.treated ? 'leaf' : 'danger',
                afterStatusLabel: selectedWaypoint?.treated ? `Remediated (${turbidityData.after.toFixed(1)})` : 'Pending',
              }}
            />

            {/* pH Level Comparative Card */}
            <StatCard
              title="Water Acidity / pH Scale"
              subtitle="Chemical Stabilization (0-14 pH)"
              category="ph"
              icon={FlaskConical}
              comparative={{
                beforeValue: phData.before.toFixed(2),
                afterValue: phData.after.toFixed(2),
                unit: 'pH',
                deltaPercent: phData.delta,
                beforeStatus: 'amber',
                beforeStatusLabel: `Acidic (${phData.before.toFixed(2)})`,
                afterStatus: selectedWaypoint?.treated ? 'leaf' : 'amber',
                afterStatusLabel: selectedWaypoint?.treated ? `Optimal (${phData.after.toFixed(2)})` : 'Pending',
              }}
            />

            {/* Dissolved Oxygen Comparative Card */}
            <StatCard
              title="Dissolved Oxygen (DO)"
              subtitle="Aeration & Dissolved Solids (mg/L)"
              category="do"
              icon={Wind}
              comparative={{
                beforeValue: doData.before.toFixed(1),
                afterValue: doData.after.toFixed(1),
                unit: 'mg/L',
                deltaPercent: doData.delta,
                beforeStatus: 'danger',
                beforeStatusLabel: `Hypoxic (${doData.before.toFixed(1)})`,
                afterStatus: selectedWaypoint?.treated ? 'leaf' : 'danger',
                afterStatusLabel: selectedWaypoint?.treated ? `Aerated (${doData.after.toFixed(1)})` : 'Pending',
              }}
            />
          </View>

          {/* 6. Action Bar */}
          <View className="space-y-3 gap-3 pt-2">
            <Button
              label={selectedWaypoint ? `Dispatch Vessel to Point ${selectedWaypoint.point_number}` : "Configure Mission"}
              variant="primary"
              size="large"
              icon={Navigation}
              disabled={!selectedWaypoint}
              onPress={() => {
                if (selectedWaypoint) {
                  dispatchRobot.mutate(selectedWaypoint.id, {
                    onSuccess: () => alert(`Dispatched SHELLOC vessel to Point ${selectedWaypoint.point_number}`)
                  });
                }
              }}
            />

            <Button
              label="Configure Mission Waypoints"
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
