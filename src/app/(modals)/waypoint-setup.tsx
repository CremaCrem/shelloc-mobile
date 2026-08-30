import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Pressable,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import MapView, { Marker, Circle } from 'react-native-maps';
import { DARK_MAP_STYLE } from '@/constants/mapStyle';
import {
  X,
  MapPin,
  Plus,
  Navigation,
  Save,
  RotateCcw,
  Layers,
  Crosshair,
  Compass,
  Check,
} from 'lucide-react-native';
import { Typography } from '@/components/core/Typography';
import { Card } from '@/components/core/Card';
import { Badge } from '@/components/core/Badge';
import { Button } from '@/components/core/Button';
import { WaypointList } from '@/components/domain/WaypointList';
import { type Waypoint } from '@/types/robot';
import { useWaypoints, useCreateWaypoint, useDeleteWaypoint } from '@/hooks/useWaypoints';
import { useDispatchRobot } from '@/hooks/useDispatch';
import { useAppStore } from '@/store/useAppStore';

export default function WaypointSetupModal() {
  const activeRobotId = useAppStore((state) => state.activeRobotId);
  const { data: waypointsData, isLoading } = useWaypoints();
  const createWaypoint = useCreateWaypoint();
  const deleteWaypoint = useDeleteWaypoint();
  const dispatchRobot = useDispatchRobot();
  
  const waypoints = waypointsData || [];
  const [activeWaypointId, setActiveWaypointId] = useState<string | null>(null);
  const [selectedCoordinates, setSelectedCoordinates] = useState({
    latitude: 14.60221,
    longitude: 120.98805,
  });
  const [isSaved, setIsSaved] = useState(false);

  const maxWaypoints = 6;
  const canAddMore = waypoints.length < maxWaypoints;

  const handleAddPin = () => {
    if (!canAddMore) {
      Alert.alert('Waypoint Limit Reached', 'You can create a maximum of 6 waypoints per mission.');
      return;
    }

    const nextPointNumber = waypoints.length + 1;
    
    createWaypoint.mutate({
      robot_id: activeRobotId,
      point_number: nextPointNumber,
      latitude: selectedCoordinates.latitude,
      longitude: selectedCoordinates.longitude,
      label: `Point ${nextPointNumber}`,
      radius_meters: 2.0,
      treated: false,
    }, {
      onSuccess: (newWaypoint) => {
        setActiveWaypointId(newWaypoint.id);
        setSelectedCoordinates((prev) => ({
          latitude: prev.latitude + 0.0008,
          longitude: prev.longitude + 0.0006,
        }));
      }
    });
  };

  const handleDeleteWaypoint = (id: string) => {
    deleteWaypoint.mutate(id);
  };

  const handleDispatchWaypoint = (waypoint: Waypoint) => {
    dispatchRobot.mutate(waypoint.id, {
      onSuccess: () => {
        setActiveWaypointId(waypoint.id);
        Alert.alert(
          'Target Waypoint Set',
          `SHELLOC will navigate autonomously to ${waypoint.label} (${waypoint.latitude.toFixed(4)}° N, ${waypoint.longitude.toFixed(4)}° E).`
        );
      }
    });
  };

  const handleSaveMission = () => {
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      router.back();
    }, 800);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Modal Header */}
      <View className="flex-row items-center justify-between px-6 py-4 bg-surface border-b border-surfaceBorder">
        <View className="flex-row items-center">
          <View className="p-2 rounded-xl bg-brandMuted border border-brand/30 mr-3">
            <MapPin size={20} color="#00F2FE" />
          </View>
          <View>
            <Typography variant="h2" color="ink" className="font-bold">
              Waypoint Setup
            </Typography>
            <Typography variant="caption" color="inkMuted">
              DEFINE UP TO 6 REMEDIATION TARGETS
            </Typography>
          </View>
        </View>

        <Pressable
          onPress={() => router.back()}
          className="p-2.5 rounded-2xl bg-surfaceElevated border border-surfaceBorder active:opacity-70"
          accessibilityRole="button"
          accessibilityLabel="Close modal"
        >
          <X size={20} color="#94A3B8" />
        </Pressable>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <View className="space-y-5 gap-5">
          {/* Top Half: Split Map Selector */}
          <Card className="p-0 overflow-hidden border border-surfaceBorder bg-surface">
            {/* Map Top Bar */}
            <View className="p-3.5 bg-surface border-b border-surfaceBorder flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Compass size={16} color="#00F2FE" className="mr-2" />
                <Typography variant="label" color="ink" className="font-semibold">
                  Interactive GPS Selector
                </Typography>
              </View>
              <Badge
                label={`${waypoints.length}/${maxWaypoints} PINS`}
                status={canAddMore ? 'brand' : 'amber'}
                size="sm"
                showDot={false}
              />
            </View>

            {/* Real Map Canvas with Interactive Pin Selector */}
            <View className="h-64 relative overflow-hidden">
              <MapView
                style={StyleSheet.absoluteFill}
                initialRegion={{
                  latitude: 14.6005,
                  longitude: 120.9855,
                  latitudeDelta: 0.006,
                  longitudeDelta: 0.006,
                }}
                customMapStyle={DARK_MAP_STYLE}
                onPress={(e) => {
                  setSelectedCoordinates(e.nativeEvent.coordinate);
                }}
              >
                {/* Render Existing Waypoints on Map */}
                {waypoints.map((wp) => {
                  const isActive = activeWaypointId === wp.id;
                  
                  return (
                    <React.Fragment key={wp.id}>
                      <Circle
                        center={{ latitude: wp.latitude, longitude: wp.longitude }}
                        radius={20}
                        fillColor={isActive ? "rgba(0, 242, 254, 0.15)" : wp.treated ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)"}
                        strokeColor={isActive ? "rgba(0, 242, 254, 0.4)" : wp.treated ? "rgba(16, 185, 129, 0.4)" : "rgba(245, 158, 11, 0.4)"}
                        strokeWidth={1}
                      />
                      <Marker
                        coordinate={{ latitude: wp.latitude, longitude: wp.longitude }}
                        onPress={() => setActiveWaypointId(wp.id)}
                        anchor={{ x: 0.5, y: 0.5 }}
                      >
                        <View className="items-center">
                          <View
                            className={`w-7 h-7 rounded-full items-center justify-center border ${
                              isActive
                                ? 'bg-brand border-brand'
                                : wp.treated
                                ? 'bg-leafMuted border-leaf'
                                : 'bg-surfaceElevated border-brand'
                            }`}
                            style={
                              isActive 
                                ? { shadowColor: '#00F2FE', shadowOpacity: 0.5, shadowRadius: 10, elevation: 5 } 
                                : (!isActive && !wp.treated) 
                                ? { borderColor: 'rgba(0, 242, 254, 0.6)' } 
                                : undefined
                            }
                          >
                            <Typography
                              variant="caption"
                              color={isActive ? 'dark' : wp.treated ? 'leaf' : 'brand'}
                              className="font-bold text-[10px]"
                            >
                              P{wp.point_number}
                            </Typography>
                          </View>
                        </View>
                      </Marker>
                    </React.Fragment>
                  );
                })}
                
                {/* Crosshair & Selected Target Pin */}
                <Marker coordinate={selectedCoordinates} anchor={{ x: 0.5, y: 0.5 }}>
                  <View className="items-center justify-center">
                    <View 
                      className="w-12 h-12 rounded-full border border-dashed border-brand animate-spin absolute" 
                      style={{ borderColor: 'rgba(0, 242, 254, 0.6)' }}
                    />
                    <Crosshair size={28} color="#00F2FE" />
                  </View>
                </Marker>
              </MapView>

              {/* Coordinate HUD Readout */}
              <View className="absolute top-3 left-3 bg-surface/90 px-3 py-1.5 rounded-xl border border-surfaceBorder" pointerEvents="none">
                <Typography variant="caption" color="inkMuted" className="font-mono text-[11px]">
                  Target: {selectedCoordinates.latitude.toFixed(6)}° N,{' '}
                  {selectedCoordinates.longitude.toFixed(6)}° E
                </Typography>
              </View>

              <View className="absolute bottom-3 right-3 bg-surface/90 px-2.5 py-1 rounded-lg border border-surfaceBorder" pointerEvents="none">
                <Typography variant="caption" color="inkSubtle" className="text-[10px]">
                  Tap map to adjust pin
                </Typography>
              </View>
            </View>

            {/* Map Action Bar */}
            <View className="p-4 bg-surface border-t border-surfaceBorder flex-col gap-3">
              <View>
                <Typography variant="caption" color="inkMuted" className="font-semibold">
                  Boundary Geofence: 2.0 Meters
                </Typography>
                <Typography variant="caption" color="inkSubtle" className="text-[11px]">
                  Auto-flocculation triggers inside boundary zone
                </Typography>
              </View>

              <Button
                label="Add Pin as Waypoint"
                variant="primary"
                size="medium"
                icon={Plus}
                disabled={!canAddMore}
                onPress={handleAddPin}
              />
            </View>
          </Card>

          {/* Bottom Half: Interactive Waypoint List */}
          <View>
            <View className="flex-row items-center justify-between mb-3">
              <Typography variant="h3" color="ink" className="font-bold">
                Configured Waypoints ({waypoints.length}/{maxWaypoints})
              </Typography>
              <Typography variant="caption" color="inkMuted">
                {6 - waypoints.length} slots available
              </Typography>
            </View>

            <WaypointList
              waypoints={waypoints}
              activeWaypointId={activeWaypointId}
              onSelectWaypoint={(wp) => setActiveWaypointId(wp.id)}
              onDeleteWaypoint={handleDeleteWaypoint}
              onDispatchWaypoint={handleDispatchWaypoint}
            />
          </View>

          {/* Bottom Mission Actions */}
          <View className="space-y-3 gap-3 pt-3">
            <Button
              label={isSaved ? 'Mission Saved!' : 'Save Waypoint Mission'}
              variant="primary"
              size="large"
              icon={isSaved ? Check : Save}
              onPress={handleSaveMission}
            />

            <Button
              label="Cancel / Return to Dashboard"
              variant="ghost"
              size="medium"
              onPress={() => router.back()}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
