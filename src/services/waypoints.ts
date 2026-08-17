import { apiClient } from './api';
import { Waypoint } from '../types/robot';

export const waypointService = {
  getWaypoints: async (robotId: string): Promise<Waypoint[]> => {
    const { data } = await apiClient.get<Waypoint[]>(`/waypoints/robot/${robotId}`);
    return data;
  },

  createWaypoint: async (waypoint: Omit<Waypoint, 'id'>): Promise<Waypoint> => {
    const { data } = await apiClient.post<Waypoint>('/waypoints/', waypoint);
    return data;
  },

  deleteWaypoint: async (waypointId: string): Promise<void> => {
    await apiClient.delete(`/waypoints/${waypointId}`);
  },
};
