import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { telemetryService } from '../services/telemetry';
import { useAppStore } from '../store/useAppStore';

// Robot is considered offline if it hasn't reported for this long.
export const OFFLINE_AFTER_SEC = 30;

// The server stores UTC times without a "Z", which phones would read as local time.
export function parseServerTime(value?: string | null): number | null {
  if (!value) return null;
  const hasZone = /([zZ]|[+-]\d{2}:?\d{2})$/.test(value);
  const ms = Date.parse(hasZone ? value : `${value}Z`);
  return Number.isNaN(ms) ? null : ms;
}

export function formatAgo(sec: number | null): string {
  if (sec === null) return 'Never';
  if (sec < 10) return 'Just now';
  if (sec < 60) return `${Math.floor(sec)}s ago`;
  if (sec < 3600) return `${Math.floor(sec / 60)} min ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)} h ago`;
  return `${Math.floor(sec / 86400)} d ago`;
}

export function missionLabel(state?: string | null): string {
  return state ? state.replace(/_/g, ' ') : 'unknown';
}

export function useTelemetry() {
  const activeRobotId = useAppStore((state) => state.activeRobotId);

  // Ticks so "last seen" and online/offline update even when the robot stops sending.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(id);
  }, []);

  const readingsQuery = useQuery({
    queryKey: ['telemetry', 'readings', activeRobotId],
    queryFn: () => telemetryService.getRecentReadings(activeRobotId),
    refetchInterval: 5000,
    staleTime: 2000,
    retry: 1,
  });

  const statusQuery = useQuery({
    queryKey: ['robot-status', activeRobotId],
    queryFn: () => telemetryService.getRobotStatus(activeRobotId),
    refetchInterval: 5000,
    staleTime: 2000,
    retry: 1,
  });

  const statusData = statusQuery.data;
  const readings = readingsQuery.data ?? [];
  const latestReading = readings[0];

  const lastSyncMs = parseServerTime(statusData?.last_sync ?? statusData?.last_updated);
  const lastSeenSec = lastSyncMs === null ? null : Math.max(0, (now - lastSyncMs) / 1000);
  const isOnline = !statusQuery.isError && lastSeenSec !== null && lastSeenSec < OFFLINE_AFTER_SEC;

  const readingMs = parseServerTime(latestReading?.timestamp);
  const readingAgeSec = readingMs === null ? null : Math.max(0, (now - readingMs) / 1000);

  const refetch = () => Promise.all([readingsQuery.refetch(), statusQuery.refetch()]);

  const missionState = statusData?.mission_state;
  const operationMode: 'autonomous' | 'manual' | undefined =
    missionState === 'manual_override' ? 'manual' : statusData?.operation_mode;
  // Joystick is only offered while the robot is online and not mid-treatment.
  const canTakeManualControl =
    isOnline && ['idle', 'navigating', 'completed', 'manual_override'].includes(missionState ?? 'idle');

  return {
    statusData,
    operationMode,
    canTakeManualControl,
    readings,
    latestReading,
    readingAgeSec,
    lastSeenSec,
    isOnline,
    refetch,
    isLoading: readingsQuery.isLoading || statusQuery.isLoading,
    isError: readingsQuery.isError || statusQuery.isError,
    error: readingsQuery.error || statusQuery.error,
  };
}
