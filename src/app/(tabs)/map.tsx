import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '@/components/core/Typography';
import MapView, { Marker, Circle, Polyline } from 'react-native-maps';
import { DARK_MAP_STYLE } from '@/constants/mapStyle';
import { Navigation, Layers, Battery, MapPin, Zap, Pause, Play, Home } from 'lucide-react-native';
import { useTelemetry } from '@/hooks/useTelemetry';
import { useWaypoints } from '@/hooks/useWaypoints';
import { useAppStore } from '@/store/useAppStore';
import { Badge } from '@/components/core/Badge';
import { router } from 'expo-router';

export default function MapScreen() {
  const { statusData } = useTelemetry();
  const { data: waypointsData } = useWaypoints();
  const geofenceRadius = useAppStore(state => state.geofenceRadiusMeters);
  
  const [showGeofence, setShowGeofence] = useState(true);
  
  const waypoints = waypointsData || [];
  
  const currentLat = statusData?.current_lat ?? 14.59972;
  const currentLng = statusData?.current_lng ?? 120.98491;

  // Derive route coordinates (Current Pos -> Waypoint 1 -> Waypoint 2 ...)
  const routeCoordinates = [
    { latitude: currentLat, longitude: currentLng },
    ...waypoints.filter(wp => !wp.treated).map(wp => ({
      latitude: wp.latitude,
      longitude: wp.longitude
    }))
  ];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-1 relative">
        <MapView
          style={StyleSheet.absoluteFill}
          initialRegion={{
            latitude: currentLat,
            longitude: currentLng,
            latitudeDelta: 0.008,
            longitudeDelta: 0.008,
          }}
          customMapStyle={DARK_MAP_STYLE}
          showsUserLocation={false}
          pitchEnabled={false}
        >
          {/* Planned Route Line */}
          {routeCoordinates.length > 1 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeColor="rgba(0, 242, 254, 0.5)"
              strokeWidth={3}
              lineDashPattern={[5, 5]}
            />
          )}

          {/* Waypoints */}
          {waypoints.map((wp) => (
            <React.Fragment key={wp.id}>
              {showGeofence && (
                <Circle
                  center={{ latitude: wp.latitude, longitude: wp.longitude }}
                  radius={geofenceRadius * 10} // Multiply by 10 just to make it visible on the map scale for demo
                  fillColor={wp.treated ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)"}
                  strokeColor={wp.treated ? "rgba(16, 185, 129, 0.3)" : "rgba(245, 158, 11, 0.3)"}
                  strokeWidth={1}
                />
              )}
              <Marker
                coordinate={{ latitude: wp.latitude, longitude: wp.longitude }}
                anchor={{ x: 0.5, y: 0.5 }}
              >
                <View className={`w-6 h-6 rounded-full items-center justify-center border ${
                  wp.treated
                    ? 'bg-leafMuted border-leaf'
                    : 'bg-surfaceElevated border-amber/60'
                }`}>
                  <Typography
                    variant="caption"
                    color={wp.treated ? 'leaf' : 'amber'}
                    className="font-bold text-[9px]"
                  >
                    P{wp.point_number}
                  </Typography>
                </View>
              </Marker>
            </React.Fragment>
          ))}

          {/* Active Vessel Marker */}
          <Marker
            coordinate={{ latitude: currentLat, longitude: currentLng }}
            anchor={{ x: 0.5, y: 0.5 }}
            zIndex={10}
          >
            <View className="items-center justify-center">
              {statusData?.is_active && (
                <View className="w-10 h-10 rounded-full bg-brand/20 border border-brand animate-ping absolute" />
              )}
              <View className="w-8 h-8 rounded-full bg-brand items-center justify-center shadow-lg shadow-brand/50 border-2 border-[#0B111E]">
                <Navigation size={14} color="#0B111E" />
              </View>
            </View>
          </Marker>
        </MapView>

        {/* Top Header HUD */}
        <View className="absolute top-4 left-4 right-4 flex-row justify-between items-start pointer-events-none">
          <View className="bg-surface/90 border border-surfaceBorder rounded-2xl p-3 shadow-lg shadow-black/50">
            <View className="flex-row items-center mb-1">
              <View className="w-2 h-2 rounded-full bg-brand mr-2 animate-pulse" />
              <Typography variant="label" color="ink" className="font-bold">
                {statusData?.robot_id || 'SHELLOC-01'}
              </Typography>
            </View>
            <Typography variant="caption" color="inkMuted" className="font-mono text-[10px]">
              {currentLat.toFixed(6)}° N
            </Typography>
            <Typography variant="caption" color="inkMuted" className="font-mono text-[10px]">
              {currentLng.toFixed(6)}° E
            </Typography>
          </View>

          <View className="items-end space-y-2 gap-2">
            <View className="bg-surface/90 border border-surfaceBorder rounded-2xl px-3 py-2 shadow-lg shadow-black/50 flex-row items-center">
              <Battery size={14} color="#10B981" className="mr-1.5" />
              <Typography variant="caption" color="ink" className="font-bold">
                {statusData?.battery_percent ?? 100}%
              </Typography>
            </View>
            <Badge 
              label={statusData?.is_active ? 'NAVIGATING' : 'STANDBY'} 
              status={statusData?.is_active ? 'brand' : 'neutral'} 
              size="sm" 
            />
          </View>
        </View>

        {/* Right Side Map Controls HUD */}
        <View className="absolute top-1/3 right-4 bg-surface/90 border border-surfaceBorder rounded-2xl shadow-lg shadow-black/50 overflow-hidden">
          <Pressable 
            className="p-3 border-b border-surfaceBorder items-center justify-center active:bg-white/5"
            onPress={() => setShowGeofence(!showGeofence)}
          >
            <Layers size={20} color={showGeofence ? "#00F2FE" : "#94A3B8"} />
          </Pressable>
          <Pressable 
            className="p-3 items-center justify-center active:bg-white/5"
            onPress={() => router.push('/(modals)/waypoint-setup' as any)}
          >
            <MapPin size={20} color="#F8FAFC" />
          </Pressable>
        </View>

        {/* Bottom Quick Action HUD */}
        <View className="absolute bottom-6 left-4 right-4 bg-surface/95 border border-surfaceBorder rounded-3xl p-4 shadow-xl shadow-black/50 flex-row justify-around items-center">
          <Pressable className="items-center justify-center active:opacity-70">
            <View className="w-12 h-12 rounded-full bg-surfaceElevated items-center justify-center mb-1">
              {statusData?.is_active ? (
                <Pause size={20} color="#EF4444" />
              ) : (
                <Play size={20} color="#10B981" />
              )}
            </View>
            <Typography variant="caption" color="inkMuted" className="text-[10px] font-bold">
              {statusData?.is_active ? 'PAUSE' : 'RESUME'}
            </Typography>
          </Pressable>

          <Pressable className="items-center justify-center active:opacity-70">
            <View className="w-14 h-14 rounded-full bg-brand/10 border border-brand items-center justify-center mb-1">
              <Zap size={24} color="#00F2FE" />
            </View>
            <Typography variant="caption" color="brand" className="text-[10px] font-bold">
              FLOC BOOST
            </Typography>
          </Pressable>

          <Pressable className="items-center justify-center active:opacity-70">
            <View className="w-12 h-12 rounded-full bg-surfaceElevated items-center justify-center mb-1">
              <Home size={20} color="#F59E0B" />
            </View>
            <Typography variant="caption" color="inkMuted" className="text-[10px] font-bold">
              RTH
            </Typography>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
