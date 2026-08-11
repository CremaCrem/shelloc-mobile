# State Management & Data Flow

This document details how data moves through the SHELLOC Mobile App, from the backend to the UI.

## 1. State Partitioning Strategy

State in the app is divided into three distinct categories to prevent unnecessary re-renders and keep logic organized.

### A. Local Component State
- **Definition:** Ephemeral state that only matters to a single component (e.g., whether a modal is open, form input values, current tab in a segmented control).
- **Tooling:** React `useState` and `useReducer`.

### B. Global App State
- **Definition:** App-wide settings or context that don't frequently change and aren't tied directly to backend data (e.g., currently paired `robot_id`, app preferences, paired status).
- **Tooling:** **Zustand** (`zustand`) for lightweight, boilerplate-free state management with optional local storage persistence via `async-storage`.

### C. Server State & Cache
- **Definition:** Data fetched from `shelloc-backend` (e.g., historical waypoints, sensor readings, treatment events). Handles loading, error, and automatic 5-second polling refetching logic.
- **Tooling:** **TanStack React Query** (`@tanstack/react-query`) for automatic HTTP caching, background refetching, and polling control.

## 2. Type Mapping (TypeScript to Backend)

The frontend's data models (`src/types`) must strictly mirror the backend's Pydantic schemas (`shelloc-backend/schemas/`). 

### Example Mapping

*Backend (Pydantic):*
```python
class RobotStatusResponse(BaseModel):
    robot_id: str
    is_active: bool
    current_action: str
    battery_level: float
    last_updated: datetime
```

*Frontend (TypeScript):*
```typescript
// src/types/robot.ts
export interface RobotStatus {
  robot_id: string;
  is_active: boolean;
  current_action: string;
  battery_level: number;
  last_updated: string; // ISO 8601 string
}
```

*Rule:* Always define TypeScript interfaces for API requests and responses. Avoid using `any`.

## 3. Real-Time Telemetry & Connection Lifecycle

Because SHELLOC relies on live sensor data (turbidity, pH, TDS, GPS), the app must maintain a persistent, real-time connection to the backend.

### Transport Protocol
**DECISION MADE: HTTP Polling (5-Second Interval)**

Given that SHELLOC is a research prototype, telemetry data (turbidity, pH, TDS, GPS) only needs to refresh every ~5 seconds. **WebSockets are NOT required.** 

Using HTTP Polling via React Query (`refetchInterval: 5000`) provides significant architectural advantages:
- **Backend Simplicity:** `shelloc-backend` remains 100% stateless and RESTful. No WebSocket connection handlers or state pools needed in FastAPI.
- **Resilience:** If cell signal or Wi-Fi drops temporarily during field testing, the next 5-second HTTP request naturally succeeds when signal returns—no complex socket reconnection logic or dead-connection pinging needed.
- **Ease of Inspection:** Polling endpoints (`GET /api/sensor-readings/latest`, `GET /api/robot-status/{id}`) can easily be tested directly in browser or Postman.

### Telemetry Fetching Strategy (HTTP Polling)

1. **Active Screen Polling:** When the user is on the `Dashboard` or `Map` screen, React Query automatically issues `GET` requests every 5 seconds.
2. **Background Pause:** When the app is backgrounded or open to static screens (like `Settings`), polling pauses to save battery and bandwidth.
3. **Data Ingestion & Smooth Animations:** When new data arrives every 5 seconds, the `StatCard` numbers and `ProgressRing` paths animate smoothly to their new values over 500ms using `react-native-reanimated`, giving the UI a fluid live feel without connection overhead.
