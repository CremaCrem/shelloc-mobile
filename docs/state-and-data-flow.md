# State Management & Data Flow

This document details how telemetry, closed-loop mission updates, and AI interactions flow through the **SHELLOC Mobile App**.

---

## 1. State Partitioning Strategy

State is structured into three clear boundaries:

```
┌───────────────────────────────────────────────────────────────┐
│                    LOCAL COMPONENT STATE                      │
│  UI modal visibility, selected waypoint tab, form inputs      │
│  Tooling: React `useState` & `useReducer`                     │
├───────────────────────────────────────────────────────────────┤
│                      GLOBAL CLIENT STATE                      │
│  Paired `robot_id`, user preferences, connection flags        │
│  Tooling: `Zustand` (In-Memory)                               │
├───────────────────────────────────────────────────────────────┤
│                     SERVER STATE & CACHE                      │
│  Sensor readings, waypoints, treatment events, AI chat logs   │
│  Tooling: `TanStack React Query` with 5s Polling              │
└───────────────────────────────────────────────────────────────┘
```

---

## 2. TypeScript Data Interfaces (`src/types/robot.ts`)

The mobile client's TypeScript definitions strictly reflect the backend's Pydantic schemas:

```typescript
export type OperationMode = 'autonomous' | 'manual';
export type GpsSignalQuality = 'good' | 'weak' | 'none';
export type SensorQualityStatus = 'good' | 'borderline' | 'critical' | 'no_data';

export type MissionState =
  | 'idle'
  | 'navigating'
  | 'baseline_evaluating'
  | 'dispensing_flocculant'
  | 'incubating_15m'
  | 'mesh_biochar_filtering'
  | 'post_evaluating'
  | 'adaptive_stabilization'
  | 'completed'
  | 'failsafe_buoyancy'
  | 'manual_override';

export interface RobotStatus {
  robot_id: string;
  operation_mode?: OperationMode;
  gps_signal?: GpsSignalQuality;
  current_lat?: number;
  current_lng?: number;
  battery_percent?: number;
  battery_level?: number;
  points_treated_today?: number;
  target_waypoint_id?: string | null;
  mission_state?: MissionState;
  flocculant_tank_percent?: number;
  citric_acid_tank_percent?: number;
  biochar_health_status?: 'optimal' | 'degraded' | 'replace';
  timer_remaining_sec?: number | null;
  buoyancy_failsafe_active?: boolean;
  last_sync?: string;
  last_updated?: string;
  overall_status?: string;
  is_active?: boolean;
  current_action?: string;
  heading_degrees?: number;
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
  temperature?: number;
  latitude?: number;
  longitude?: number;
  timestamp: string;
  status?: SensorQualityStatus;
}

export interface TreatmentEvent {
  id: string;
  robot_id: string;
  waypoint_id: string;
  moringa_chitosan_ml: number;
  flocculant_dosed_ml?: number;
  citric_acid_ml: number;
  biochar_filtration_applied?: boolean;
  floc_aggregation_time_sec?: number;
  secondary_treatment_applied?: boolean;
  secondary_reagent_type?: 'flocculant' | 'citric_acid' | null;
  secondary_dosage_ml?: number | null;
  started_at: string;
  ended_at?: string | null;
  outcome?: string | null;
}
```

---

## 3. Real-Time Telemetry & Synchronization

1. **HTTP Polling (Telemetry & Status):**
   - Maintained by `services/telemetry.ts`.
   - React Query uses `refetchInterval: 5000` to automatically maintain a seamless data stream over standard REST.
2. **WebSocket (Manual Control Only):**
   - Used exclusively for sending joystick override commands (e.g., when the operator taps "Manual Override").
   - Not used for receiving sensor data.
3. **Smooth Animated Transitions:**
   - Numeric telemetry and SVG progress paths animate smoothly over 500ms using `react-native-reanimated`.
