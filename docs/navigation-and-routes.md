# Navigation & Routing Strategy

This document outlines the screen architecture, navigation flows, and deep linking setup for the SHELLOC Mobile App.

The app uses **Expo Router**, a file-based routing system built on top of React Navigation.

## 1. Expo Router Tree Structure (`src/app`)

The app's layout is centered around an icon-forward bottom tab bar, ensuring core features are always one tap away.

```text
src/app/
├── _layout.tsx           # Global root layout (Providers, Deep link config)
├── +not-found.tsx        # Fallback route for unmatched paths
├── settings.tsx          # Root Stack: App and robot configuration
├── (tabs)/               # Main bottom tab bar layout
│   ├── _layout.tsx       # Tab bar configuration & icon mapping
│   ├── index.tsx         # Home/Dashboard: Live telemetry (StatCards, ProgressRings)
│   ├── map.tsx           # GPS Map: Waypoints & Pollution Heatmaps
│   ├── treatments.tsx    # History: Past treatment events & logs
│   ├── chat.tsx          # AI: Plain-language sensor interpretation chat
│   └── diagnostics.tsx   # Diagnostics: Detailed sensor telemetry and system health
└── (modals)/             # Presentation modals (slide up over tabs)
    └── waypoint-setup.tsx # Modal: Select coordinates to add a new waypoint
```

## 2. Access Control: Robot Pairing Flow

**DECISION MADE: Robot Pairing Flow (No User Password Login)**

Because backend reads are unauthenticated, the app does not require a formal username/password login. Instead, it uses a simplified **Robot Pairing** setup:

1. **Launch Check:** When the app launches, the layout checks Zustand state / local storage for a paired `robot_id` (e.g., `robot-01`).
2. **Paired State:** If a `robot_id` exists, the user is seamlessly routed to `/(tabs)/index` (Dashboard).
3. **Fallback:** Currently, the app defaults to mock fallback or existing telemetry state if not strictly paired.
4. **Switching Robots:** Users can unpair or select a different robot anytime via the Settings screen (`/settings`).

## 3. Deep Linking & Critical Alerts (`shelloc://`)

Deep linking allows the app to be launched directly into specific screens when responding to critical telemetry alerts or push notifications.

### Configuration
In `app.json`, the app's scheme is defined:
```json
{
  "expo": {
    "scheme": "shelloc"
  }
}
```

### Critical Telemetry Alert Route Mappings
- `shelloc://diagnostics?alert=critical_turbidity` -> Opens the diagnostics screen and focuses on the Turbidity StatCard alert.
- `shelloc://map?waypoint_id={id}` -> Opens the Map tab, highlighting the waypoint where a critical sensor threshold was reached.
- `shelloc://chat?context=alert` -> Launches the AI chat pre-populated with a request to explain the recent telemetry alert in plain language.
