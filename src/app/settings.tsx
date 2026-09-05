import React, { useState } from 'react';
import { View, ScrollView, TextInput, Switch, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '@/components/core/Typography';
import { StatusBar } from 'expo-status-bar';
import { Network, Server, Settings as SettingsIcon, Droplets, MapPin, Activity } from 'lucide-react-native';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/core/Button';
import { apiClient } from '@/services/api';
import Toast from 'react-native-toast-message';

export default function SettingsScreen() {
  const { 
    activeRobotId, 
    apiBaseUrl,
    setApiBaseUrl,
    isDemoMode,
    setIsDemoMode,
    geofenceRadiusMeters,
    setGeofenceRadiusMeters,
    flocculantCapacityMl,
    setFlocculantCapacityMl
  } = useAppStore();

  const [tempUrl, setTempUrl] = useState(apiBaseUrl);
  const [isPinging, setIsPinging] = useState(false);

  const handlePingTest = async () => {
    setIsPinging(true);
    setApiBaseUrl(tempUrl); // Apply URL first
    try {
      // Ping the active robot status endpoint to verify connectivity
      await apiClient.get(`/robot-status/${activeRobotId}`, { timeout: 3000 });
      Toast.show({
        type: 'success',
        text1: 'Connection Successful',
        text2: `Successfully reached API at ${tempUrl}`,
      });
    } catch (error) {
      // Interceptor will handle the error toast
      Toast.show({
        type: 'error',
        text1: 'Connection Failed',
        text2: 'Could not reach the backend server.',
      });
    } finally {
      setIsPinging(false);
    }
  };

  const adjustGeofence = (amount: number) => {
    const newVal = Math.max(0.5, Math.min(10.0, geofenceRadiusMeters + amount));
    setGeofenceRadiusMeters(Number(newVal.toFixed(1)));
  };

  const adjustFlocculant = (amount: number) => {
    const newVal = Math.max(100, Math.min(5000, flocculantCapacityMl + amount));
    setFlocculantCapacityMl(newVal);
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView className="flex-1 px-4 py-2" contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* Section 1: Server Connection */}
        <View className="mb-8">
          <View className="flex-row items-center mb-4">
            <Server size={20} color="#00F2FE" className="mr-2" />
            <Typography variant="h3" color="ink" className="font-bold">
              API Connection
            </Typography>
          </View>
          
          <View className="bg-surfaceElevated p-4 rounded-2xl border border-surfaceBorder space-y-4">
            <View>
              <Typography variant="label" color="inkMuted" className="mb-2 uppercase tracking-wider font-semibold">
                Base URL
              </Typography>
              <View className="bg-[#0B111E] rounded-xl border border-surfaceBorder px-4 h-12 justify-center">
                <TextInput
                  value={tempUrl}
                  onChangeText={setTempUrl}
                  className="text-ink font-mono text-[13px]"
                  placeholder="https://shelloc-backend.onrender.com/api"
                  placeholderTextColor="#475569"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>
            
            <Button 
              label={isPinging ? "Pinging..." : "Test Connection & Save"} 
              variant="primary" 
              size="medium"
              icon={Network}
              onPress={handlePingTest}
              disabled={isPinging}
            />
          </View>
        </View>

        {/* Section 3: Calibration */}
        <View className="mb-8">
          <View className="flex-row items-center mb-4">
            <Activity size={20} color="#00F2FE" className="mr-2" />
            <Typography variant="h3" color="ink" className="font-bold">
              Remediation Parameters
            </Typography>
          </View>
          
          <View className="bg-surfaceElevated p-4 rounded-2xl border border-surfaceBorder space-y-5 gap-5">
            {/* Geofence */}
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <MapPin size={20} color="#94A3B8" className="mr-3" />
                <View>
                  <Typography variant="label" color="ink" className="font-semibold">Geofence Radius</Typography>
                  <Typography variant="caption" color="inkMuted">Target tolerance zone</Typography>
                </View>
              </View>
              
              <View className="flex-row items-center bg-[#0B111E] rounded-xl border border-surfaceBorder">
                <Pressable onPress={() => adjustGeofence(-0.5)} className="px-3 py-2">
                  <Typography variant="label" color="brand" className="font-bold">-</Typography>
                </Pressable>
                <Typography variant="label" color="ink" className="font-mono w-10 text-center">
                  {geofenceRadiusMeters}m
                </Typography>
                <Pressable onPress={() => adjustGeofence(0.5)} className="px-3 py-2">
                  <Typography variant="label" color="brand" className="font-bold">+</Typography>
                </Pressable>
              </View>
            </View>

            <View className="h-px bg-surfaceBorder w-full" />

            {/* Flocculant */}
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <Droplets size={20} color="#94A3B8" className="mr-3" />
                <View>
                  <Typography variant="label" color="ink" className="font-semibold">Floc Tank Capacity</Typography>
                  <Typography variant="caption" color="inkMuted">Max cartridge volume</Typography>
                </View>
              </View>
              
              <View className="flex-row items-center bg-[#0B111E] rounded-xl border border-surfaceBorder">
                <Pressable onPress={() => adjustFlocculant(-50)} className="px-3 py-2">
                  <Typography variant="label" color="brand" className="font-bold">-</Typography>
                </Pressable>
                <Typography variant="label" color="ink" className="font-mono w-12 text-center text-[12px]">
                  {flocculantCapacityMl}
                </Typography>
                <Pressable onPress={() => adjustFlocculant(50)} className="px-3 py-2">
                  <Typography variant="label" color="brand" className="font-bold">+</Typography>
                </Pressable>
              </View>
            </View>
          </View>
        </View>

        {/* Section 4: Developer / Debug */}
        <View className="mb-10">
          <View className="bg-surfaceElevated p-4 rounded-2xl border border-surfaceBorder flex-row justify-between items-center">
            <View>
              <Typography variant="label" color="ink" className="font-semibold">
                Simulated Telemetry
              </Typography>
              <Typography variant="caption" color="inkMuted">
                Enable local sensor mock stream
              </Typography>
            </View>
            <Switch 
              value={isDemoMode}
              onValueChange={setIsDemoMode}
              trackColor={{ false: '#1E293B', true: '#00F2FE' }}
              thumbColor={'#F8FAFC'}
            />
          </View>
        </View>

      </ScrollView>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}
