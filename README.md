# SHELLOC Mobile App

> **S**mart **H**ydro-**E**nvironmental **L**ocator and C**l**eaner — Mobile Companion Application

React Native (Expo SDK ~57) companion application for the **SHELLOC** autonomous water-remediation robotic vessel. Delivers real-time closed-loop telemetry monitoring, geospatial waypoint missions, consumable reservoir tracking, and Google Gemini AI insights.

---

## 📱 Unified 4-View Navigation

The mobile application organizes all operational capabilities into a clean 4-tab bottom navigation layout:

1. **Home (`/index`):** Real-time telemetry command center (Turbidity, pH, TDS, Temp), reagent reservoir levels (Moringa-Chitosan %, Citric Acid %), 15-minute incubation countdown timer, and buoyancy failsafe alerts.
2. **Diagnostics (`/diagnostics`):** Interactive GPS Zone Map with 2m geofence boundaries, waypoint selector drawer, before/after comparative delta cards, and raw telemetry data tables.
3. **AI Chat (`/chat`):** Conversational water remediation assistant powered by Google Gemini (`gemini-3.7-flash`).
4. **Feedback Display / Activity Log (`/activity`):** Chronological activity timeline, dual-reagent dispensing audit trails, and treatment event summary tables.

---

## 📖 Architecture & Documentation

Detailed technical documentation is available in the `docs/` folder:

1. **[Architecture Overview](docs/architecture.md)** – Tech stack, layer separation, closed-loop features, and directory structure.
2. **[Navigation & Routing](docs/navigation-and-routes.md)** – Unified 4-view hierarchy, deep links, and screen blueprints.
3. **[Design System & Component Specs](docs/design-system.md)** – Tokens, typography, and domain widgets (15m countdown timer, reagent gauges, buoyancy alert).
4. **[State Management & Data Flow](docs/state-and-data-flow.md)** – Zustand, React Query, WebSocket telemetry, and TypeScript definitions.
5. **[Development Guide](docs/development-guide.md)** – Local development, Expo CLI, iOS simulator, and Android APK builds.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npx expo start

# 3. Run on iOS Simulator
npx expo start --ios

# 4. Run on Android Emulator
npx expo start --android
```
