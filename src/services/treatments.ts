import { apiClient } from './api';
import { TreatmentEvent } from '../types/robot';

export const treatmentService = {
  getTreatmentEvents: async (robotId: string): Promise<TreatmentEvent[]> => {
    const { data } = await apiClient.get<TreatmentEvent[]>(`/treatment-events/?robot_id=${robotId}`);
    return data;
  },
};
