import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { waypointService } from '../services/waypoints';
import { useAppStore } from '../store/useAppStore';

export function useWaypoints() {
  const activeRobotId = useAppStore((state) => state.activeRobotId);

  return useQuery({
    queryKey: ['waypoints', activeRobotId],
    queryFn: () => waypointService.getWaypoints(activeRobotId),
    refetchInterval: 5000,
  });
}

export function useCreateWaypoint() {
  const queryClient = useQueryClient();
  const activeRobotId = useAppStore((state) => state.activeRobotId);

  return useMutation({
    mutationFn: waypointService.createWaypoint,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waypoints', activeRobotId] });
    },
  });
}

export function useDeleteWaypoint() {
  const queryClient = useQueryClient();
  const activeRobotId = useAppStore((state) => state.activeRobotId);

  return useMutation({
    mutationFn: waypointService.deleteWaypoint,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waypoints', activeRobotId] });
    },
  });
}
