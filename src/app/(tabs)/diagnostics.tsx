import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  RefreshControl,
  Dimensions,
  StyleSheet,
  Modal,
  Image,
  TouchableOpacity,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import MapView, { Marker, Circle } from 'react-native-maps';
import { DARK_MAP_STYLE } from '@/constants/mapStyle';
import {
  Activity,
  Droplet,
  FlaskConical,
  Thermometer,
  Waves,
  Navigation,
  Radio,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sliders,
  Maximize2,
  Gamepad2,
} from 'lucide-react-native';
import { Typography } from '@/components/core/Typography';
import { Card } from '@/components/core/Card';
import { Badge } from '@/components/core/Badge';
import { Button } from '@/components/core/Button';
import { StatusHeader } from '@/components/core/StatusHeader';
import { StatCard } from '@/components/domain/StatCard';
import { BuoyancyAlert } from '@/components/domain/BuoyancyAlert';
import { AdaptiveRemediationBadge } from '@/components/domain/AdaptiveRemediationBadge';
import { useTelemetry, missionLabel } from '@/hooks/useTelemetry';
import { useWaypoints } from '@/hooks/useWaypoints';
import { useDispatchRobot } from '@/hooks/useDispatch';
import { useTreatments } from '@/hooks/useTreatments';
import type { SensorReading } from '@/types/robot';

type ReadingKey = 'turbidity' | 'ph' | 'tds' | 'temperature';

function readValue(r: SensorReading | null | undefined, key: ReadingKey): number | undefined {
  if (!r) return undefined;
  switch (key) {
    case 'turbidity': return r.turbidity_ntu ?? r.turbidity;
    case 'ph': return r.ph;
    case 'tds': return r.tds_ppm ?? r.tds;
    case 'temperature': return r.temperature;
  }
}

export default function DiagnosticsScreen() {
  const { statusData, isLoading, isOnline, operationMode, canTakeManualControl, refetch } = useTelemetry();
  const { data: waypointsData, refetch: refetchWaypoints } = useWaypoints();
  const { data: treatments } = useTreatments();
  const mapRef = useRef<MapView>(null);
  const hasCentered = useRef(false);
  const dispatchRobot = useDispatchRobot();
  
  const waypoints = waypointsData || [];
  const [selectedPointIndex, setSelectedPointIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const prevMissionState = useRef(statusData?.mission_state);

  useEffect(() => {
    if (
      prevMissionState.current &&
      prevMissionState.current !== 'completed' &&
      statusData?.mission_state === 'completed'
    ) {
      setShowSuccessModal(true);
    }
    prevMissionState.current = statusData?.mission_state;
  }, [statusData?.mission_state]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetch(), refetchWaypoints()]);
    } finally {
      setRefreshing(false);
    }
  };

  const hasPosition = typeof statusData?.current_lat === 'number' && typeof statusData?.current_lng === 'number';

  // Center the map once on the robot (or the first waypoint) when data first arrives.
  useEffect(() => {
    if (hasCentered.current) return;
    const target = hasPosition
      ? { latitude: statusData!.current_lat!, longitude: statusData!.current_lng! }
      : waypointsData?.[0]
      ? { latitude: waypointsData[0].latitude, longitude: waypointsData[0].longitude }
      : null;
    if (target && mapRef.current) {
      mapRef.current.animateToRegion({ ...target, latitudeDelta: 0.005, longitudeDelta: 0.005 }, 500);
      hasCentered.current = true;
    }
  }, [hasPosition, statusData, waypointsData]);

  const selectedWaypoint = waypoints[selectedPointIndex] || null;

  // Before/after values for the selected waypoint. Missing readings stay missing ("--").
  const getComparativeData = (key: ReadingKey, digits: number) => {
    const before = readValue(selectedWaypoint?.before_reading, key);
    const after = readValue(selectedWaypoint?.after_reading, key);
    const delta = before !== undefined && after !== undefined && before > 0
      ? ((after - before) / before) * 100
      : undefined;
    return {
      before: before === undefined ? '--' : before.toFixed(digits),
      after: after === undefined ? '--' : after.toFixed(digits),
      delta,
      beforeLabel: before === undefined ? 'NO DATA' : 'MEASURED',
      afterLabel: after === undefined ? (before === undefined ? 'NO DATA' : 'PENDING') : 'MEASURED',
      afterStatus: (after === undefined ? 'amber' : 'brand') as 'amber' | 'brand',
    };
  };

  const turbidityData = getComparativeData('turbidity', 1);
  const phData = getComparativeData('ph', 2);
  const tdsData = getComparativeData('tds', 0);
  const temperatureData = getComparativeData('temperature', 1);

  // Extra reagent dose, only if the robot actually logged one for this waypoint.
  const secondaryReagent = treatments?.find(
    (t) => t.waypoint_id === selectedWaypoint?.id && t.secondary_treatment_applied
  )?.secondary_reagent_type ?? null;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
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
        connection={isLoading ? 'connecting' : isOnline ? 'connected' : 'disconnected'}
        state={missionLabel(statusData?.mission_state)}
        operationMode={isOnline ? operationMode : undefined}
        batteryPercent={statusData?.battery_percent ?? '--'}
        gpsSignal={statusData?.gps_signal}
      />

      {/* Active Mission Banner */}
      {statusData?.mission_state && statusData.mission_state !== 'idle' && (
        <View className="px-6 py-3 bg-brand/10 border-b border-brand/30 flex-row items-center">
          <View className="w-2.5 h-2.5 rounded-full bg-brand mr-3" style={{ shadowColor: '#00F2FE', shadowOpacity: 0.8, shadowRadius: 6, elevation: 4 }} />
          <View className="flex-1">
            <Typography variant="caption" color="brand" className="uppercase font-semibold tracking-widest text-[9px] mb-0.5" style={{ opacity: 0.8 }}>
              Active Mission Phase
            </Typography>
            <Typography variant="label" color="brand" className="font-bold">
              {statusData.mission_state.replace(/_/g, ' ').toUpperCase()}
            </Typography>
          </View>
        </View>
      )}

      <BuoyancyAlert isVisible={statusData?.overall_status === 'buoyancy_failsafe' || statusData?.buoyancy_failsafe_active === true} />

      {/* Mission Complete Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(11, 17, 30, 0.9)', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <View className="items-center justify-center mb-6">
            <View className="w-24 h-24 rounded-full bg-leafMuted items-center justify-center mb-4" style={{ borderColor: 'rgba(16, 185, 129, 0.4)', borderWidth: 1 }}>
              <CheckCircle2 size={48} color="#10B981" />
            </View>
            <Typography variant="h1" color="ink" className="font-bold text-center mb-2">
              Remediation Successful
            </Typography>
            <Typography variant="body" color="inkMuted" className="text-center px-4">
              The autonomous vessel has successfully neutralized the designated target zone.
            </Typography>
          </View>
          <View style={{ width: '100%', maxWidth: 280 }}>
            <Button
              label="Acknowledge"
              variant="primary"
              size="large"
              onPress={() => setShowSuccessModal(false)}
            />
          </View>
        </View>
      </Modal>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00F2FE" />
        }
      >
        <View className="space-y-5 gap-5">
          {/* 1. Map Overview with Numbered Waypoints */}
          <Card className="p-0 overflow-hidden border border-surfaceBorder bg-surface">
            {/* Map Header Overlay */}
            <View className="p-4 bg-surface/90 border-b border-surfaceBorder flex-row items-center justify-between flex-wrap gap-2">
              <View className="flex-row items-center flex-1 pr-2">
                <Radio size={16} color="#00F2FE" className="mr-2 flex-shrink-0" />
                <Typography variant="h3" color="ink" className="text-base font-semibold flex-shrink" numberOfLines={1}>
                  Autonomous Waypoint Radar
                </Typography>
              </View>
              <Badge label="GEOFENCE: 2.0M" status="neutral" size="sm" showDot={false} />
            </View>

            {/* Real Interactive Map Canvas */}
            <View className="h-64 relative overflow-hidden">
              <MapView
                ref={mapRef}
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
                        radius={wp.radius_meters ?? 2}
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
                        <View style={{
                          width: 32,
                          height: 32,
                          borderRadius: 16,
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderWidth: 1,
                          backgroundColor: isSelected ? '#00F2FE' : isTreated ? 'rgba(16, 185, 129, 0.2)' : '#1E293B',
                          borderColor: isSelected ? '#00F2FE' : isTreated ? '#10B981' : 'rgba(245, 158, 11, 0.6)',
                          shadowColor: isSelected ? '#00F2FE' : 'transparent',
                          shadowOpacity: isSelected ? 0.5 : 0,
                          shadowRadius: 5,
                          elevation: isSelected ? 5 : 0
                        }}>
                          <Text style={{
                            fontWeight: 'bold',
                            fontSize: 11,
                            color: isSelected ? '#0B111E' : isTreated ? '#10B981' : '#F59E0B'
                          }}>
                            P{wp.point_number}
                          </Text>
                        </View>
                      </Marker>
                    </React.Fragment>
                  );
                })}

                {/* Robot Current Position — Turtle Marker (only when the robot reported one) */}
                {hasPosition && (
                <Marker
                  coordinate={{
                    latitude: statusData!.current_lat!,
                    longitude: statusData!.current_lng!,
                  }}
                  anchor={{ x: 0.5, y: 0.5 }}
                  zIndex={10}
                  flat={true}
                  rotation={statusData?.heading_degrees ?? 0}
                >
                  <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      backgroundColor: 'rgba(0, 242, 254, 0.15)',
                      borderColor: '#00F2FE',
                      borderWidth: 1.5,
                      alignItems: 'center',
                      justifyContent: 'center',
                      shadowColor: '#00F2FE',
                      shadowOpacity: 0.4,
                      shadowRadius: 8,
                      elevation: 6,
                    }}>
                      <Image
                        source={require('@/assets/images/turtle-marker.png')}
                        style={{ width: 28, height: 28, tintColor: '#00F2FE' }}
                        resizeMode="contain"
                      />
                    </View>
                  </View>
                </Marker>
                )}
              </MapView>

              {/* Coordinate HUD Readout */}
              <View className="absolute bottom-2 left-3 bg-surface/85 px-2.5 py-1 rounded-lg border border-surfaceBorder" pointerEvents="none">
                <Typography variant="caption" color="inkMuted" className="font-mono text-[10px]">
                  {hasPosition
                    ? `Vessel: ${statusData!.current_lat!.toFixed(5)}° N, ${statusData!.current_lng!.toFixed(5)}° E`
                    : 'Vessel position: not reported'}
                </Typography>
              </View>
            </View>

            {/* 2. Status Legend Bar */}
            <View className="p-3 bg-surfaceElevated border-t border-surfaceBorder flex-row items-center flex-wrap gap-3">
              <View className="flex-row items-center">
                <View className={`w-2 h-2 rounded-full mr-1.5 ${isOnline && statusData?.gps_signal === 'good' ? 'bg-leaf' : 'bg-amber'}`} />
                <Typography variant="caption" color="inkMuted" className="text-[11px] font-medium">
                  GPS: {isOnline && statusData?.gps_signal ? statusData.gps_signal.toUpperCase() : '--'}
                </Typography>
              </View>

              <View className="flex-row items-center">
                <View className="w-2 h-2 rounded-full bg-brand mr-1.5" />
                <Typography variant="caption" color="inkMuted" className="text-[11px] font-medium">
                  Mode: {isOnline && operationMode ? (operationMode === 'autonomous' ? 'Auto' : 'Manual') : '--'}
                </Typography>
              </View>

              <View className="flex-row items-center">
                <View className={`w-2 h-2 rounded-full mr-1.5 ${isOnline ? 'bg-leaf' : 'bg-inkSubtle'}`} />
                <Typography variant="caption" color="inkMuted" className="text-[11px] font-medium">
                  Battery: {statusData?.battery_percent !== undefined ? `${statusData.battery_percent}%` : '--'}
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
                        ? 'bg-brand border-brand'
                        : wp.treated
                        ? 'bg-surface border-surfaceBorder'
                        : 'bg-surfaceElevated border-surfaceBorder'
                    }`}
                    style={
                      isSelected
                        ? {
                            shadowColor: '#00F2FE',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.3,
                            shadowRadius: 2,
                            elevation: 2,
                          }
                        : undefined
                    }
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
                        style={isSelected ? { backgroundColor: 'rgba(0, 0, 0, 0.2)' } : undefined}
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

              <View className="items-end">
                <Badge
                  label={selectedWaypoint.treated ? 'REMEDIATED' : 'UNTREATED'}
                  status={selectedWaypoint.treated ? 'leaf' : 'amber'}
                  size="md"
                />
                <View className="mt-2">
                  <AdaptiveRemediationBadge
                    reagentType={secondaryReagent}
                    isVisible={Boolean(secondaryReagent)}
                  />
                </View>
              </View>
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
                beforeValue: turbidityData.before,
                afterValue: turbidityData.after,
                unit: 'NTU',
                deltaPercent: turbidityData.delta,
                beforeStatus: 'neutral',
                beforeStatusLabel: turbidityData.beforeLabel,
                afterStatus: turbidityData.afterStatus,
                afterStatusLabel: turbidityData.afterLabel,
              }}
            />

            {/* pH Level Comparative Card */}
            <StatCard
              title="Water Acidity / pH Scale"
              subtitle="Chemical Stabilization (0-14 pH)"
              category="ph"
              icon={FlaskConical}
              comparative={{
                beforeValue: phData.before,
                afterValue: phData.after,
                unit: 'pH',
                deltaPercent: phData.delta,
                beforeStatus: 'neutral',
                beforeStatusLabel: phData.beforeLabel,
                afterStatus: phData.afterStatus,
                afterStatusLabel: phData.afterLabel,
              }}
            />

            {/* TDS Comparative Card */}
            <StatCard
              title="Total Dissolved Solids"
              subtitle="Water Purity & Conductivity (ppm)"
              category="tds"
              icon={Waves}
              comparative={{
                beforeValue: tdsData.before,
                afterValue: tdsData.after,
                unit: 'ppm',
                deltaPercent: tdsData.delta,
                beforeStatus: 'neutral',
                beforeStatusLabel: tdsData.beforeLabel,
                afterStatus: tdsData.afterStatus,
                afterStatusLabel: tdsData.afterLabel,
              }}
            />

            {/* Temperature Comparative Card */}
            <StatCard
              title="Water Temperature"
              subtitle="Thermal Monitoring (°C)"
              category="temperature"
              icon={Thermometer}
              comparative={{
                beforeValue: temperatureData.before,
                afterValue: temperatureData.after,
                unit: '°C',
                deltaPercent: temperatureData.delta,
                beforeStatus: 'neutral',
                beforeStatusLabel: temperatureData.beforeLabel,
                afterStatus: temperatureData.afterStatus,
                afterStatusLabel: temperatureData.afterLabel,
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
              disabled={!selectedWaypoint || Boolean(statusData?.mission_state && statusData.mission_state !== 'idle' && statusData.mission_state !== 'completed')}
              onPress={() => {
                if (selectedWaypoint) {
                  dispatchRobot.mutate(selectedWaypoint.id, {
                    onSuccess: () => {
                      Toast.show({
                        type: 'success',
                        text1: 'Dispatch Successful',
                        text2: `SHELLOC vessel is en route to Point ${selectedWaypoint.point_number}.`,
                        position: 'top',
                        topOffset: 55,
                      });
                    },
                    onError: (error: any) => {
                      Toast.show({
                        type: 'error',
                        text1: 'Dispatch Failed',
                        text2: error?.message || 'The vessel cannot accept new targets right now.',
                        position: 'top',
                        topOffset: 55,
                      });
                    }
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

          {/* 7. Manual Override FAB */}
          <TouchableOpacity
            style={[fabStyles.fab, !canTakeManualControl && fabStyles.fabDisabled]}
            onPress={() => router.push('/(modals)/manual-override' as any)}
            activeOpacity={0.8}
            disabled={!canTakeManualControl}
          >
            <Gamepad2 size={22} color={canTakeManualControl ? "#fff" : "#94A3B8"} />
            <Text style={[fabStyles.fabLabel, !canTakeManualControl && { color: "#94A3B8" }]}>
              {canTakeManualControl ? 'Manual Override' : isOnline ? 'Manual Override (busy)' : 'Manual Override (robot offline)'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const fabStyles = StyleSheet.create({
  fab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  fabDisabled: {
    backgroundColor: '#334155',
    shadowOpacity: 0,
    elevation: 0,
  },
  fabLabel: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 10,
  },
});
