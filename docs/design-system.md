# SHELLOC Design System & Component Specification

This document defines the visual design language, theme tokens, and reusable component specifications for the **SHELLOC Mobile Companion App**.

The design language delivers a high-precision, technical, and premium **Autonomous Robotics Dark Mode** aesthetic. It leverages a deep navy/slate canvas, elevated slate cards, glowing neon status indicators, and vibrant cyan/teal brand accents to provide high readability in outdoor marine environments.

---

## 1. Design Tokens (NativeWind / Tailwind CSS)

Configured in `tailwind.config.js` and exported via `src/constants/theme.ts`.

### Color Palette

| Token | Hex / Value | Semantic Role & Wireframe Context | Tailwind Utility Classes |
|---|---|---|---|
| `background` | `#0B111E` | Deep navy base canvas for all screens | `bg-background` |
| `surface` | `#151F32` | Primary elevated card & container background | `bg-surface` |
| `surfaceElevated` | `#1E293B` | Interactive items, inputs, table rows, secondary elements | `bg-surfaceElevated` |
| `surfaceBorder` | `#23334E` | Subtle divider and card boundary border (depth stroke) | `border-surfaceBorder` |
| `surfaceHover` | `#223354` | Active/focused card or row highlight state | `bg-surfaceHover` |
| `ink` | `#F8FAFC` | High-contrast crisp white text (headings, primary metrics) | `text-ink` |
| `inkMuted` | `#94A3B8` | Secondary slate text, labels, coordinate units, timestamps | `text-inkMuted` |
| `inkSubtle` | `#64748B` | Disabled text, subtle legends, decorative glyphs | `text-inkSubtle` |
| `inkDark` | `#0B111E` | Deep dark text used over high-luminance brand badges/buttons | `text-inkDark` |
| `brand` | `#00F2FE` | Vibrant Teal / Cyan primary action, active tabs, highlights | `bg-brand`, `text-brand`, `border-brand` |
| `brandDark` | `#0284C7` | Deep cyan gradient fill and active press states | `bg-brandDark` |
| `brandMuted` | `rgba(0, 242, 254, 0.12)` | Tinted cyan glowing chip backgrounds | `bg-brandMuted` |
| `leaf` | `#10B981` | Neon / Mint Green for "Autonomous", "Good", active GPS | `bg-leaf`, `text-leaf`, `border-leaf` |
| `leafMuted` | `rgba(16, 185, 129, 0.15)` | Glowing green status pill background | `bg-leafMuted` |
| `danger` | `#EF4444` | Bright Coral / Red for "Critical", "Delete", "Disconnect" | `bg-danger`, `text-danger`, `border-danger` |
| `dangerMuted` | `rgba(239, 68, 68, 0.15)` | Glowing red alert pill background | `bg-dangerMuted` |
| `amber` | `#F59E0B` | Amber / Yellow for "Warning", "Borderline", "Low Battery" | `bg-amber`, `text-amber`, `border-amber` |
| `amberMuted` | `rgba(245, 158, 11, 0.15)` | Glowing amber warning pill background | `bg-amberMuted` |

---

## 2. Typography Scale

The app utilizes a clean, geometric sans-serif font family (**Inter** / **Plus Jakarta Sans**, falling back to system UI sans-serif).

| Variant | Size | Weight | Line Height | Usage Example |
|---|---|---|---|---|
| **H1** | `28px` (`text-3xl`) | `Bold` (700) | `34px` | Large Telemetry Numbers, Modal Titles |
| **H2** | `22px` (`text-2xl`) | `SemiBold` (600) | `28px` | Screen Headers, Section Banners |
| **H3** | `18px` (`text-lg`) | `Medium` (500) / `SemiBold` | `24px` | Card Titles, Waypoint Labels |
| **Body** | `16px` (`text-base`) | `Regular` (400) | `22px` | Descriptive paragraphs, Modal explanations |
| **Label** | `14px` (`text-sm`) | `Medium` (500) | `18px` | Button text, Metric sub-headers, Tab labels |
| **Caption** | `12px` (`text-xs`) | `Regular` (400) / `Medium` | `16px` | Timestamps, Lat/Lng coordinates, Status tags |

---

## 3. Spacing, Borders & Radii

- **Base Spacing Grid:** Standard 4px scale (`p-2` = 8px, `p-3` = 12px, `p-4` = 16px, `p-6` = 24px).
- **Border Radii:**
  - **Cards & Containers:** `rounded-2xl` (16px) or `rounded-3xl` (24px).
  - **Buttons & Badges:** `rounded-full` (pill shape).
  - **Icons & Micro Avatars:** `rounded-xl` (12px).
- **Borders:** Consistent 1px subtle stroke (`border border-surfaceBorder`) on all elevated cards.
- **Minimum Touch Targets:** Adheres to iOS/Android HIG with minimum dimensions of **44x44 points**.

---

## 4. Core Component Specifications (`src/components/core/`)

### 1. `Card` (`Card.tsx`)
- Dark elevated container (`bg-surface`), border stroke (`border border-surfaceBorder`), rounded corners (`rounded-3xl`), padded (`p-5` or `p-6`).
- Supports interactive scale micro-interactions (`scale: 0.98`) when `onPress` is supplied.

### 2. `Badge` (`Badge.tsx`)
- Pill-shaped status tag with dot beacon. Variants:
  - `leaf` (Neon Green): "AUTO", "GOOD", "OPTIMAL", "REMEDIATED", "LOCKED"
  - `danger` (Coral Red): "CRITICAL", "ERROR", "FAILSAFE"
  - `amber` (Amber Yellow): "WARNING", "ACIDIC", "INCUBATING", "PENDING"
  - `brand` (Vibrant Cyan): "ACTIVE", "DISPATCHED", "STABILIZING"
  - `neutral` (Slate): "IDLE", "STANDBY"

### 3. `Button` (`Button.tsx`)
- Pill-shaped tactile button with spring physics.
- Variants: `primary` (Cyan), `secondary` (Slate), `danger` (Coral), `outline` (Stroke).

### 4. `StatusHeader` (`StatusHeader.tsx`)
- Elevated top bar displaying robot identifier, live pulse indicator (Connected / Connecting / Disconnected), operational mode, and battery gauge.

---

## 5. Domain Component Specifications (`src/components/domain/`)

### 1. `StatCard` (`StatCard.tsx`)
- **Comparative Mode (Diagnostics):** Renders before-vs-after delta readouts for Turbidity (NTU), pH, TDS (ppm), and Temperature (°C).
- **Live Metric Mode (Home):** Displays single parameter real-time value, sparkline, and status beacon.

### 2. `CountdownTimer` (15-Minute Incubation Widget)
- **Visuals:** Circular SVG progress ring surrounding a prominent digital readout (`MM:SS`).
- **Behavior:** Binds to `timer_remaining_sec` from the robot's WebSocket stream during the `incubating_15m` phase. Features a pulsing brand glow ring when active.
- **Completion Trigger:** Fires an animated transition when timer reaches `00:00`, alerting the operator that biochar filtration has commenced.

### 3. `ReagentGauge` (Consumables Reservoir Card)
- **Visuals:** Multi-tank horizontal progress bars displaying:
  - **Moringa-Chitosan Tank:** `0–100%` (Cyan bar) with low-reservoir warning `< 20%`.
  - **Citric Acid Tank:** `0–100%` (Amber bar) with low-reservoir warning `< 15%`.
  - **Biochar Cartridge Status:** Health pill tag (`OPTIMAL`, `DEGRADED`, `REPLACE`).

### 4. `BuoyancyAlert` (Failsafe Banner)
- **Visuals:** High-visibility coral/amber warning banner with an animated pulsing warning triangle icon.
- **Trigger:** Activates when `overall_status === "buoyancy_failsafe"` or `buoyancy_failsafe_active === True`.
- **Message:** *"GPS Signal Lost: Buoyancy Ballast Pump Active (120 mL/min). Elevating antenna mast to restore satellite lock."*

### 5. `AdaptiveRemediationBadge` (Stabilization Callout)
- **Visuals:** Specialized pill tag rendered on Diagnostics and Activity views when closed-loop post-treatment dosing occurs:
  - `Citric Acid: +15 mL (pH Neutralization)`
  - `Secondary Moringa: +20 mL (Turbidity Clearing)`

---

## 6. Unified 4-View Screen Blueprint

```text
src/app/
├── _layout.tsx                 # Root layout, React Query provider & ThemeProvider
├── +not-found.tsx              # Fallback route
├── settings.tsx                # Robot pairing & calibration
└── (tabs)/
    ├── _layout.tsx             # 4-Tab bottom bar (Home, Diagnostics, AI Chat, Activity)
    ├── index.tsx               # [View 1] Home (Telemetry HUD, Reagents, Buoyancy Banner)
    ├── diagnostics.tsx         # [View 2] Diagnostics (Zone Map, Radar, Delta Gauges, Table)
    ├── chat.tsx                # [View 3] AI Chat (Google Gemini Remediation Insights)
    └── activity.tsx            # [View 4] Feedback Display / Activity Log (Timeline & Table)
```

---

## 7. NativeWind v4 Styling Safety Rules

Tailwind opacity modifiers (e.g. `shadow-brand/40`, `bg-surface/90`) inside dynamic JSX template expressions trigger an async CSS parsing path that can race with React Navigation initialization.

- **The Rule:** If a class string with an opacity modifier changes dynamically at runtime, pass the opacity via an inline `style` prop (e.g. `style={{ shadowColor: '#00F2FE', shadowOpacity: 0.4 }}`) rather than a dynamic `className`.

---

## 8. Global UX & Notifications

### 1. API Error & Success Feedback
- **Tooling:** `react-native-toast-message`
- **Behavior:** All explicit user actions (e.g., dispatching a waypoint) that communicate with the backend must trigger a top-down toast notification (`position: 'top'`, `topOffset: 55`). 
- **Visuals:** Uses standard toast types (`success`, `error`) to prevent alert fatigue while ensuring critical feedback (e.g. API 400 rejection on double-dispatch) is visible above all other UI elements.

### 2. Mission Complete UX (`MissionCompleteModal`)
- **Trigger:** Auto-triggers in `diagnostics.tsx` when the `statusData.mission_state` transitions from an active phase to `completed`.
- **Visuals:** Full-screen immersive modal.
  - **Backdrop:** Semi-transparent dark background (`bg-background/90`).
  - **Iconography:** Giant `CheckCircle2` colored with the `leaf` token.
  - **Typography:** "Remediation Successful" using H1, and an acknowledgment button.
- **Purpose:** Delivers a premium, satisfying conclusion to the automated remediation cycle without relying on easily-missed standard toasts.
