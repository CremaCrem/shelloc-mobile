export interface RobotStatus {
  robot_id: string;
  is_active: boolean;
  current_action: string;
  battery_level: number;
  last_updated: string;
}

export interface SensorReading {
  id: number;
  robot_id: string;
  timestamp: string;
  turbidity: number;
  ph: number;
  tds: number;
  temperature: number;
  latitude: number;
  longitude: number;
}
