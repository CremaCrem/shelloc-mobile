# Navigation & Routing Strategy

This document outlines the screen architecture, navigation flows, and deep linking setup for the **SHELLOC Mobile App**, built using **Expo Router** on React Native.

---

## 1. Unified 4-View Navigation Hierarchy

The companion application organizes all operational capabilities into a **4-view unified layout**, providing intuitive mobile access to live telemetry, spatial mapping, AI insights, and historical mission logs.

```text
src/app/
├── _layout.tsx              # Root layout (Providers, Theme, Deep Linking)
├── +not-found.tsx           # 404 Fallback route
├── settings.tsx             # Root Stack: Robot pairing & hardware settings
├── (tabs)/                  # Main 4-Tab Bottom Navigation Bar
│   ├── _layout.tsx          # Tab bar layout & Lucide icon configuration
│   ├── index.tsx            # [View 1] Home (Telemetry Command Center & Tank HUD)
│   ├── diagnostics.tsx      # [View 2] Diagnostics (GPS Zone Map & Diagnostics Table)
│   ├── chat.tsx             # [View 3] AI Chat (Google Gemini Remediation Assistant)
│   └── activity.tsx         # [View 4] Feedback Display / Activity Log (Summary Table & Timeline)
└── (modals)/                # Overlay sheets
    └── waypoint-setup.tsx   # Modal: Tap-to-place waypoint mission configuration
```

---

## 2. Tab-by-Tab Screen Specifications

### Tab 1: Home (`/(tabs)/index`)
- **Purpose:** Primary command dashboard and vessel readiness overview.
- **Key Modules:**
  - **Live Sensor Telemetry HUD:** Real-time stat cards displaying Turbidity (NTU), pH level, TDS (ppm), and Temperature (°C).
  - **Reagent Consumables Gauge:** Visual progress indicators for Moringa-Chitosan tank (%), Citric Acid tank (%), and Biochar cartridge status.
  - **Operational State Banner:** Displays active mission state (`idle`, `navigating`, `baseline_evaluating`, `dispensing_flocculant`, `incubating_15m`, `mesh_biochar_filtering`, `post_evaluating`, `adaptive_stabilization`, `completed`).
  - **15-Minute Incubation Timer Widget:** Animated countdown wheel displayed during the `incubating_15m` aggregation phase.
  - **Buoyancy Failsafe Alert Banner:** Prominent warning alert triggered when GPS signal drops and the vessel activates its 120 mL/min ballast evacuation pump.

### Tab 2: Diagnostics (`/(tabs)/diagnostics`)
- **Purpose:** Interactive geospatial mission tracking and comparative water quality analysis.
- **Key Modules:**
  - **GPS Zone Map:** Full-screen interactive map displaying the aquatic treatment area, robot vessel position marker, and up to 6 target waypoints with 2-meter boundary geofences.
  - **Waypoint Selection Drawer:** Horizontal chips to select target waypoints (`P1` through `P6`) for telemetry inspection or vessel dispatch.
  - **Comparative Telemetry Gauges:** Visual before-vs-after delta displays for Turbidity, pH, and Dissolved Solids.
  - **Diagnostics Data Table:** Tabular readout of raw sensor voltages, GPS satellite lock quality, and SONAR obstacle proximity.

### Tab 3: AI Chat (`/(tabs)/chat`)
- **Purpose:** Conversational telemetry interpretation and environmental science insights powered by Google Gemini.
- **Key Modules:**
  - **Telemetry Grounding:** Queries automatically inject a snapshot of current robot readings, target waypoint history, and consumable levels.
  - **Actionable Remediation Guidance:** Highlights recommendations (e.g., flocculant volume adjustments, biochar replacement, alkaline neutralization).
  - **Multi-Turn Memory:** Preserves recent chat context within the session.

### Tab 4: Feedback Display / Activity Log (`/(tabs)/activity`)
- **Purpose:** Comprehensive remediation audit trail and historical logs.
- **Key Modules:**
  - **Activity Timeline:** Chronological stream of robot actions (waypoint arrival, primary dosing, 15m timer completion, biochar filtration sweep, adaptive Citric Acid stabilization).
  - **Treatment Summary Table:** Tabular log recording `started_at`, `flocculant_dosed_ml`, `citric_acid_dosed_ml`, `biochar_filtration_applied`, `floc_aggregation_time_sec`, and remediation `outcome`.

---

## 3. Robot Pairing & Access Control

The app uses a lightweight **Robot Pairing Flow** rather than traditional user account logins:
1. **Startup Check:** On initial launch, the app inspects local storage (via Zustand + `AsyncStorage`) for a paired `robot_id` (e.g., `"SHELLOC-01"`).
2. **Auto-Route:** If paired, the app immediately mounts `/(tabs)/index`.
3. **Switching / Unpairing:** Operators can select or change target robots anytime via the Settings screen (`/settings`).

---

## 4. Deep Linking Configuration (`shelloc://`)

The app registers the `shelloc://` URL scheme for instant navigation to critical operational views:

| URL Scheme | Target View | Behavior |
|---|---|---|
| `shelloc://home` | Home Tab | Focuses telemetry HUD |
| `shelloc://diagnostics?waypoint_id={id}` | Diagnostics Tab | Selects and centers the specified waypoint on the GPS radar |
| `shelloc://chat?prompt={encoded_text}` | AI Chat Tab | Opens chat with pre-populated diagnostic query |
| `shelloc://activity?event_id={id}` | Activity Tab | Highlights the specific treatment event in the summary table |
| `shelloc://alert?type=buoyancy` | Home Tab | Expands the Buoyancy Failsafe alert banner |
