export type OperationMode = 'autonomous' | 'manual';
export type GpsSignalQuality = 'good' | 'weak' | 'none';
export type MissionState = 'idle' | 'navigating' | 'inside_boundary' | 'treating' | 'completed';
export type SensorQualityStatus = 'good' | 'borderline' | 'critical' | 'no_data';

export interface RobotStatus {
  robot_id: string;
  operation_mode?: OperationMode;
  gps_signal?: GpsSignalQuality;
  current_lat?: number;
  current_lng?: number;
  battery_percent?: number;
  battery_level?: number; // legacy alias
  points_treated_today?: number;
  target_waypoint_id?: string | null;
  mission_state?: MissionState;
  last_sync?: string;
  last_updated?: string;
  overall_status?: string;
  is_active?: boolean;
  current_action?: string;
}

export interface SensorReading {
  id: string | number;
  robot_id: string;
  waypoint_id?: string;
  phase?: 'before' | 'after';
  turbidity?: number;
  turbidity_ntu?: number;
  ph: number;
  tds?: number;
  tds_ppm?: number;
  dissolved_oxygen?: number; // DO in mg/L
  temperature?: number;
  nir_floc_score?: number | null;
  latitude?: number;
  longitude?: number;
  timestamp: string;
  status?: SensorQualityStatus;
}

export interface Waypoint {
  id: string;
  robot_id: string;
  point_number: number;
  latitude: number;
  longitude: number;
  label?: string;
  radius_meters: number;
  treated: boolean;
  treated_at?: string | null;
  before_reading_id?: string | null;
  after_reading_id?: string | null;
  before_reading?: SensorReading | null;
  after_reading?: SensorReading | null;
}

export interface TreatmentEvent {
  id: string;
  robot_id: string;
  waypoint_id: string;
  flocculant_dosed_ml: number;
  started_at: string;
  ended_at?: string | null;
  outcome?: string | null;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  robot_id: string;
  role: 'user' | 'assistant';
  message: string;
  timestamp: string;
  context_snapshot?: any;
}
