# Navigation & Routing Strategy

This document outlines the screen architecture, navigation flows, and deep linking setup for the SHELLOC Mobile App.

The app uses **Expo Router**, a file-based routing system built on top of React Navigation.

## 1. Expo Router Tree Structure (`src/app`)

The app's layout is centered around an icon-forward bottom tab bar, ensuring core features are always one tap away.

```text
src/app/
├── _layout.tsx           # Global root layout (Providers, Deep link config)
├── index.tsx             # Auth / Initial gateway (Redirects to tabs or auth)
├── (auth)/               # Unauthenticated routes group
│   └── login.tsx         # Login or setup screen
├── (tabs)/               # Main bottom tab bar layout
│   ├── _layout.tsx       # Tab bar configuration & icon mapping
│   ├── dashboard.tsx     # Home: Live telemetry (StatCards, ProgressRings)
│   ├── map.tsx           # GPS Map: Waypoints & Pollution Heatmaps
│   ├── treatments.tsx    # History: Past treatment events & logs
│   └── ai-chat.tsx       # AI: Plain-language sensor interpretation chat
└── (modals)/             # Presentation modals (slide up over tabs)
    ├── add-waypoint.tsx  # Modal: Select coordinates to add a new waypoint
    └── settings.tsx      # Modal: App and robot configuration
```

## 2. Access Control: Robot Pairing Flow

**DECISION MADE: Robot Pairing Flow (No User Password Login)**

Because backend reads are unauthenticated, the app does not require a formal username/password login. Instead, it uses a simplified **Robot Pairing** setup:

1. **Launch Check:** When the app launches, `src/app/index.tsx` checks Zustand state / local storage for a paired `robot_id` (e.g., `robot-01`).
2. **Paired State:** If a `robot_id` exists, the user is seamlessly routed to `/(tabs)/dashboard`.
3. **Unpaired State:** If no `robot_id` exists, the app routes to `/(auth)/pair` (Pairing screen where the user enters or scans a Robot ID QR code).
4. **Switching Robots:** Users can unpair or select a different robot anytime via the Settings modal (`/(modals)/settings`).

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
- `shelloc://dashboard?alert=critical_turbidity` -> Opens dashboard and focuses on the Turbidity StatCard alert.
- `shelloc://map?waypoint_id={id}` -> Opens the Map tab, highlighting the waypoint where a critical sensor threshold was reached.
- `shelloc://ai-chat?context=alert` -> Launches the AI chat pre-populated with a request to explain the recent telemetry alert in plain language.
