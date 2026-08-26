# Architecture Overview

This document serves as the high-level technical blueprint for the **SHELLOC Mobile App**. It outlines HOW the client is structured, how responsibilities are separated, and how it integrates with the robot and the backend.

## 1. System Context

**SHELLOC Mobile** is a React Native (Expo) companion app for the SHELLOC autonomous water-remediation robot. It allows users to view live telemetry (turbidity, pH, TDS, GPS), manage treatment waypoints, view pollution heatmaps, and interact with an AI chat assistant to interpret sensor data in plain language.

### Tech Stack

- **Framework:** React Native 0.86 via Expo SDK ~57
- **Language:** TypeScript
- **Routing:** Expo Router (File-based routing)
- **Styling:** NativeWind (Tailwind CSS v3.4 for React Native)
- **Animations:** React Native Reanimated 4.5
- **Icons/Vectors:** `lucide-react-native` (Standardized cross-platform icon suite)
- **State Management:** **Zustand** (Global app state) & **React Query** (Server state & caching)

## 2. Layered Architecture

The application is structured into four distinct layers to separate UI rendering from business logic, data fetching, and hardware/device integration.

### A. UI Layer (`src/app` & `src/components`)
- **Responsibility:** Rendering screens, routing, layouts, and reusable design system components.
- **Rule:** UI components should be "dumb" where possible. They should receive data as props or via custom hooks and emit events (e.g., `onPress`).
- **Styling:** Uses NativeWind utility classes to apply the design system tokens.

### B. Hooks / Logic Layer (`src/hooks`)
- **Responsibility:** Encapsulating complex component logic, composing state and side effects.
- **Rule:** If a component has more than a couple of `useState` or `useEffect` calls, extract that logic into a custom hook (e.g., `useTelemetryStream()`, `useAIChat()`).

### C. State & Cache Layer (Zustand & React Query)
- **Responsibility:** Managing global app state (e.g., selected robot `robot_id`, app preferences via Zustand) and caching server data (e.g., historical waypoints, treatment events via React Query).
- **Rule:** Local state stays in components/hooks. Server state is managed by React Query (`@tanstack/react-query`) to handle loading, error, and automatic 5-second polling refetching.

### D. Network & Hardware Layer (`src/services`)
- **Responsibility:** Abstracting API calls, WebSocket/MQTT connections, and native device capabilities.
- **Rule:** The UI layer should NEVER make direct `fetch()` calls. All network requests must go through API client wrappers defined in `services/`.

## 3. Folder Structure Plan

```text
src/
├── app/                  # Expo Router file-based routes
│   ├── (tabs)/           # Main bottom tab navigation
│   ├── (modals)/         # Full-screen or sheet modals
│   ├── _layout.tsx       # Root layout & providers
│   └── settings.tsx      # Root stack routes
├── components/           # Reusable UI components
│   ├── core/             # Design system components (Button, Card, Typography)
│   ├── domain/           # Feature-specific components (StatCard, HeatmapView)
│   └── layout/           # Screen wrappers, safe area containers
├── constants/            # Configuration and static data
│   ├── theme.ts          # NativeWind/Tailwind theme overrides/exports
│   └── config.ts         # Environment variables & API URLs
├── hooks/                # Custom React hooks
├── services/             # API clients, WebSocket managers, device APIs
│   ├── api.ts            # REST client wrapper (Axios or Fetch)
│   └── telemetry.ts      # Real-time data stream manager
├── types/                # TypeScript interfaces & types (mapping to backend schemas)
└── utils/                # Helper functions (date formatting, unit conversions)
```

## 4. Interaction with Backend

The mobile app relies entirely on the **SHELLOC FastAPI Backend** as its source of truth.
- **REST API:** Used for fetching historical data (waypoints, past treatments) and submitting configurations.
- **Real-Time Data (HTTP Polling):** Telemetry (turbidity, pH, TDS) and robot status updates are polled every 5 seconds via standard HTTP GET requests (`refetchInterval: 5000` via React Query). WebSockets are not required for the research prototype scale.
- **AI Chat:** The app sends user messages to the backend's AI endpoints, which return plain-language insights based on current robot telemetry context.
