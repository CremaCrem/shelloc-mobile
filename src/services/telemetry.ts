import { apiClient } from './api';
import { RobotStatus, SensorReading } from '../types/robot';

export const telemetryService = {
  getLatestReading: async (robotId: string): Promise<SensorReading> => {
    // Note: Depends on backend implementation. Assuming standard REST path.
    const { data } = await apiClient.get<SensorReading>(`/sensor-readings/latest?robot_id=${robotId}`);
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
