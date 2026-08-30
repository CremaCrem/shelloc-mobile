import React, { useState } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Layers, Droplet, Clock, CheckCircle2, History } from 'lucide-react-native';
import { Typography } from '@/components/core/Typography';
import { Card } from '@/components/core/Card';
import { Badge } from '@/components/core/Badge';
import { useTreatments } from '@/hooks/useTreatments';

export default function TreatmentsScreen() {
  const { data: treatments, isLoading, isError, refetch } = useTreatments();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Screen Title Bar */}
      <View className="flex-row items-center px-6 py-3.5 bg-surface border-b border-surfaceBorder">
        <View className="p-2 rounded-xl bg-brandMuted border border-brand/30 mr-3">
          <History size={20} color="#00F2FE" />
        </View>
        <View>
          <Typography variant="h2" color="ink" className="font-bold">
            Treatment Log
          </Typography>
          <Typography variant="caption" color="inkMuted">
            HISTORICAL REMEDIATION EVENTS
          </Typography>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00F2FE" />
        }
      >
        {isLoading && !refreshing && (
          <View className="flex-1 items-center justify-center py-20">
            <Typography variant="body" color="inkMuted">Loading treatments...</Typography>
          </View>
        )}

        {isError && (
          <View className="flex-1 items-center justify-center py-20">
            <Typography variant="body" color="danger">Failed to load treatments.</Typography>
          </View>
        )}

        {!isLoading && !isError && treatments?.length === 0 && (
          <View className="flex-1 items-center justify-center py-20">
            <Layers size={48} color="#1A253A" className="mb-4" />
            <Typography variant="body" color="inkMuted">No treatments recorded yet.</Typography>
          </View>
        )}

        <View className="space-y-4 gap-4">
          {treatments?.map((treatment) => (
            <Card key={treatment.id} className="p-4 bg-surfaceElevated border border-surfaceBorder">
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-row items-center">
                  <CheckCircle2 size={18} color="#10B981" className="mr-2" />
                  <Typography variant="label" color="ink" className="font-bold">
                    Target Remediated
                  </Typography>
                </View>
                <Badge
                  label={treatment.outcome === 'success' ? 'SUCCESS' : treatment.outcome?.toUpperCase() || 'COMPLETED'}
                  status={treatment.outcome === 'success' ? 'leaf' : 'neutral'}
                  size="sm"
                  showDot={false}
                />
              </View>

              <View className="h-px bg-surfaceBorder w-full mb-3" />

              <View className="flex-row justify-between items-center mb-2">
                <View className="flex-row items-center">
                  <Clock size={14} color="#94A3B8" className="mr-2" />
                  <Typography variant="caption" color="inkMuted">Time</Typography>
                </View>
                <Typography variant="label" color="ink" className="font-mono">
                  {formatDate(treatment.started_at)}
                </Typography>
              </View>

              <View className="flex-row justify-between items-center mb-2">
                <View className="flex-row items-center">
                  <Droplet size={14} color="#00F2FE" className="mr-2" />
                  <Typography variant="caption" color="inkMuted">Flocculant Dosed</Typography>
                </View>
                <Typography variant="label" color="ink" className="font-mono">
                  {treatment.flocculant_dosed_ml} mL
                </Typography>
              </View>
              
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center mr-2 flex-shrink-0">
                  <Layers size={14} color="#94A3B8" className="mr-2" />
                  <Typography variant="caption" color="inkMuted">Waypoint ID</Typography>
                </View>
                <View className="flex-shrink items-end">
                  <Typography variant="caption" color="inkSubtle" className="font-mono text-[10px]" numberOfLines={1} ellipsizeMode="middle">
                    {treatment.waypoint_id}
                  </Typography>
                </View>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
