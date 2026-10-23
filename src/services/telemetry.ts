import { apiClient } from './api';
import { RobotStatus, SensorReading } from '../types/robot';

export const telemetryService = {
  // Newest first. Used for the live readings and their mini trend lines.
  getRecentReadings: async (robotId: string, limit = 12): Promise<SensorReading[]> => {
    const { data } = await apiClient.get<SensorReading[]>('/sensor-readings/', {
      params: { robot_id: robotId, limit },
    });
    return data;
  },

  getRobotStatus: async (robotId: string): Promise<RobotStatus> => {
    const { data } = await apiClient.get<RobotStatus>(`/robot-status/${robotId}`);
    return data;
  },

  dispatchRobot: async (robotId: string, waypointId: string): Promise<RobotStatus> => {
    const { data } = await apiClient.patch<RobotStatus>(`/robot-status/${robotId}`, {
      target_waypoint_id: waypointId,
      is_active: true,
    });
    return data;
  },
};
