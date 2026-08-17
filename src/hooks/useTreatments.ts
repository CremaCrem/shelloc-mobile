import { useQuery } from '@tanstack/react-query';
import { treatmentService } from '../services/treatments';
import { useAppStore } from '../store/useAppStore';

export function useTreatments() {
  const activeRobotId = useAppStore((state) => state.activeRobotId);

  return useQuery({
    queryKey: ['treatments', activeRobotId],
    queryFn: () => treatmentService.getTreatmentEvents(activeRobotId),
  });
}
