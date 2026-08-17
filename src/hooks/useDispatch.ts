import { useMutation, useQueryClient } from '@tanstack/react-query';
import { telemetryService } from '../services/telemetry';
import { useAppStore } from '../store/useAppStore';

export function useDispatchRobot() {
  const queryClient = useQueryClient();
  const activeRobotId = useAppStore((state) => state.activeRobotId);

  return useMutation({
    mutationFn: (waypointId: string) => telemetryService.dispatchRobot(activeRobotId, waypointId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['robot-status', activeRobotId] });
    },
  });
}
