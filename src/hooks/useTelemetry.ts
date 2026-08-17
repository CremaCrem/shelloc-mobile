import { useQuery } from '@tanstack/react-query';
import { telemetryService } from '../services/telemetry';
import { useAppStore } from '../store/useAppStore';

export function useTelemetry() {
  const activeRobotId = useAppStore((state) => state.activeRobotId);

  // Poll sensor readings every 5 seconds
  const sensorQuery = useQuery({
    queryKey: ['telemetry', 'latest', activeRobotId],
    queryFn: () => telemetryService.getLatestReading(activeRobotId),
    refetchInterval: 5000,
    staleTime: 2000,
    retry: 1,
  });

  // Poll robot status every 5 seconds
  const statusQuery = useQuery({
    queryKey: ['robot-status', activeRobotId],
    queryFn: () => telemetryService.getRobotStatus(activeRobotId),
    refetchInterval: 5000,
    staleTime: 2000,
    retry: 1,
  });

  return {
    sensorData: sensorQuery.data,
    statusData: statusQuery.data,
    isLoading: sensorQuery.isLoading || statusQuery.isLoading,
    isError: sensorQuery.isError || statusQuery.isError,
    error: sensorQuery.error || statusQuery.error,
  };
}
