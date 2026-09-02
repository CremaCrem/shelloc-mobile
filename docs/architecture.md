# Architecture Overview

This document provides the high-level technical architecture for the **SHELLOC Mobile Companion App**, detailing its layered architecture, state synchronization, component structure, and closed-loop bioremediation support.

---

## 1. System Context

**SHELLOC Mobile** is a React Native companion application built on **Expo** designed for field operators monitoring the SHELLOC autonomous water-remediation robot. It provides real-time telemetry streaming, interactive waypoint mission setup, closed-loop treatment tracking, and AI-assisted data interpretation powered by **Google Gemini**.

### Tech Stack

- **Framework:** React Native 0.86 with Expo SDK ~57 (iOS & Android)
- **Language:** TypeScript
- **Navigation:** Expo Router (File-based routing with 4-view bottom tab bar)
- **Styling:** NativeWind (Tailwind CSS v3.4 for React Native)
- **Animations:** React Native Reanimated 4.5
- **Iconography:** `lucide-react-native`
- **State Management:** **Zustand** (Local/Global client state) & **TanStack React Query** (Server state, caching, 5-second polling/WebSocket sync)
- **AI Integration:** Google Gemini (`gemini-3.7-flash` via Backend AI Gateway)

---

## 2. Layered Architecture

The codebase strictly follows a four-layer separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                    UI LAYER (`src/app`)                     │
│  4 Unified Views: Home, Diagnostics, AI Chat, Feedback Log  │
├─────────────────────────────────────────────────────────────┤
│               COMPONENT LAYER (`src/components`)            │
│  Core Design System & Domain Widgets (Countdown, Gauges)    │
├─────────────────────────────────────────────────────────────┤
│                 LOGIC LAYER (`src/hooks`)                   │
│  `useTelemetry`, `useWaypoints`, `useAIChat`, `useJoystick` │
├─────────────────────────────────────────────────────────────┤
│         STATE & TRANSPORT LAYER (`src/services`, `store`)   │
│  React Query, Zustand, Bi-directional WebSocket Client      │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Directory Structure

```text
src/
├── app/                  # Expo Router file-based routes
│   ├── (tabs)/           # Unified 4-view tab bar
│   │   ├── _layout.tsx   # Tab bar navigation & icon definitions
│   │   ├── index.tsx     # [1] Home (Telemetry HUD & Tank Levels)
│   │   ├── diagnostics.tsx# [2] Diagnostics (GPS Zone Map & Comparison)
│   │   ├── chat.tsx      # [3] AI Chat (Google Gemini Assistant)
│   │   └── activity.tsx  # [4] Feedback Display / Activity Log
│   ├── (modals)/         # Modal presentation sheets
│   │   ├── waypoint-setup.tsx
│   │   └── joystick.tsx  # Forced-landscape manual override controller
│   ├── _layout.tsx       # Root layout & providers
│   ├── +not-found.tsx    # Unmatched path handler
│   └── settings.tsx      # Robot pairing and configuration
├── components/           # Reusable UI component library
│   ├── core/             # Design tokens: Button, Card, Badge, Typography
│   └── domain/           # Feature widgets: CountdownTimer, ReagentGauge, StatCard, BuoyancyAlert
├── constants/            # Design tokens, theme constants, and API configuration
├── hooks/                # Custom React hooks encapsulating business logic
├── services/             # REST and WebSocket client wrappers
├── store/                # Zustand global state slices (paired robot ID, preferences)
├── types/                # TypeScript interfaces mirroring backend Pydantic schemas
└── utils/                # Date formatting, math helpers, and unit converters
```

---

## 4. Closed-Loop Feature Integration

1. **Adaptive 9-State Lifecycle Synchronization:** The mobile client listens for `mission_state` transitions broadcast from the backend (`/ws/robot/{id}` or 5-second polling), animating UI status badges accordingly.
2. **15-Minute Incubation Countdown:** When the robot enters `incubating_15m`, the client renders an animated circular countdown displaying `timer_remaining_sec`.
3. **Consumable Reagent Telemetry:** The Home view tracks Moringa-Chitosan and Citric Acid reservoir percentages and biochar filter health.
4. **Buoyancy Failsafe Alerting:** If GPS is lost and the vessel engages its ballast evacuation pump (`buoyancy_failsafe_active = True`), a top-level alert banner alerts the operator immediately.
5. **Google Gemini AI Assistant:** The AI Chat tab provides natural-language telemetry interpretation, evaluating whether water parameters have met remediation thresholds ($NTU < 20$, $pH\ 6.0\text{–}7.0$, $TDS\ \sim 200\text{ ppm}$).
