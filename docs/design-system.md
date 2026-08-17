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
  - **Cards & Modal Containers:** `rounded-2xl` (16px) or `rounded-3xl` (24px) for modern, soft-edged ergonomics.
  - **Buttons & Status Badges:** `rounded-full` (pill shape).
  - **Icons & Mini Avatars:** `rounded-xl` (12px).
- **Borders:** Consistent 1px subtle borders (`border border-surfaceBorder`) on all elevated cards to prevent dark surfaces from blending into the canvas.
- **Minimum Touch Targets:** All interactive pressables adhere strictly to Apple/Android HIG guidelines with minimum dimensions of **44x44 points**.

---

## 4. Core Component Specifications (`src/components/core/`)

### 1. `Card`
- **Location:** `src/components/core/Card.tsx`
- **Visuals:** Dark elevated container (`bg-surface`), subtle stroke (`border border-surfaceBorder`), rounded corners (`rounded-3xl`), padded (`p-5` or `p-6`), soft drop shadow.
- **Interactive:** When `onPress` is supplied, wraps inside a Reanimated `AnimatedPressable` that springs down (`scale: 0.98`) upon press.
- **Accessibility:** Automatically assigns `accessibilityRole="button"` when interactive.

### 2. `Badge`
- **Location:** `src/components/core/Badge.tsx`
- **Visuals:** Pill-shaped status tag (`rounded-full px-3 py-1 flex-row items-center`) with a glowing dot beacon.
- **Variants:**
  - `leaf` (Neon Green): "AUTONOMOUS", "GOOD", "REMEDIATED", "GPS LOCKED"
  - `danger` (Coral Red): "CRITICAL", "ERROR", "DELETE"
  - `amber` (Amber Yellow): "BORDERLINE", "WARNING", "WEAK SIGNAL"
  - `brand` (Vibrant Cyan): "ACTIVE TARGET", "DISPATCHED", "CALIBRATED"
  - `neutral` (Elevated Slate): "IDLE", "STANDBY", "PENDING"

### 3. `Button`
- **Location:** `src/components/core/Button.tsx`
- **Visuals:** Pill-shaped button (`rounded-full`) with tactile spring micro-interactions (`useSharedValue` and `withSpring`).
- **Variants:**
  - `primary`: Vibrant Teal/Cyan (`bg-brand border border-brand text-inkDark font-bold`)
  - `secondary`: Elevated dark slate (`bg-surfaceElevated border border-surfaceBorder text-ink`)
  - `danger`: High-visibility Coral/Red (`bg-danger text-white` or `bg-dangerMuted border border-danger text-danger`)
  - `outline`: Border stroke (`bg-transparent border border-brand text-brand`)
- **Sizes:**
  - `small`: Height ≥ 36px (`px-4 py-2`)
  - `medium`: Height ≥ 44px (`px-5 py-2.5`)
  - `large`: Height ≥ 52px (`px-6 py-3.5`)
- **Features:** Supports leading icon, trailing icon, loading indicator, and disabled states.

### 4. `Typography`
- **Location:** `src/components/core/Typography.tsx`
- **Visuals:** Standardized typographic element managing hierarchy (`h1`, `h2`, `h3`, `body`, `label`, `caption`) and dark palette colors (`ink`, `inkMuted`, `brand`, `leaf`, `danger`, `amber`, `white`).

### 5. `StatusHeader`
- **Location:** `src/components/core/StatusHeader.tsx`
- **Visuals:** Elevated header card displaying robot identity, live connection pulse beacon (Connected / Connecting / Disconnected), active mission state, and battery status.

---

## 5. Domain Component Specifications (`src/components/domain/`)

### 1. `StatCard`
- **Location:** `src/components/domain/StatCard.tsx`
- **Modes:**
  1. **Comparative Telemetry Mode (Diagnostics Wireframe):**
     - Compares **"Before Treatment"** vs **"After Treatment"** metrics (Turbidity, pH, Dissolved Oxygen / TDS).
     - Renders dual metric readouts side-by-side with Delta improvement badge (e.g., `-88.6%`, `+30.8%`), status tags ("Good", "Acidic", "Remediated"), and category iconography.
  2. **Single Metric Mode (Dashboard Live Stream):**
     - Renders single real-time metric value, unit, status badge, and embedded SVG sparkline trend.
- **Categories:** `turbidity` (Cyan/Coral), `ph` (Mint/Leaf), `tds` (Amber), `do` (Blue/Teal), `general` (Brand).

### 2. `WaypointList`
- **Location:** `src/components/domain/WaypointList.tsx`
- **Purpose:** Interactive list for managing robot mission waypoints (Points 1–6).
- **Features:**
  - Numbered index chip (`P1`, `P2`, `P3`...)
  - Precision GPS coordinate readout (`14.599512° N, 120.984221° E`)
  - 2-Meter boundary radius tag (`2.0m zone`)
  - Treatment state indicator (`Treated` vs `Pending`)
  - Danger action button (`Delete` with Coral/Red trash icon)
  - Quick target dispatch button
  - Empty state when no waypoints exist.

### 3. `ProgressRing` & `Sparkline`
- **Location:** `src/components/domain/ProgressRing.tsx` & `src/components/domain/Sparkline.tsx`
- **Visuals:** Hardware-accelerated SVG rings and sparklines driven by React Native Reanimated for smooth, dynamic data animations.

---

## 6. Layout & Screen Blueprint

```text
src/app/
├── _layout.tsx                 # Root layout, React Query provider & ThemeProvider
├── (tabs)/
│   ├── _layout.tsx             # Bottom tab bar with cyan active icons & dark bar
│   ├── index.tsx               # Entry point (redirects/renders Dashboard)
│   ├── dashboard.tsx           # Home Dashboard: 2-column Bento Grid (About, Operation, Points Today, etc.)
│   ├── diagnostics.tsx         # Diagnostics Screen: Map + Status Legend + Comparative Point 1 Data
│   ├── map.tsx                 # GPS Map View & Heatmaps
│   ├── treatments.tsx          # Treatment History & Event Logs
│   └── chat.tsx                # AI Plain-Language Assistant Chat
└── (modals)/
    └── waypoint-setup.tsx      # Waypoint Setup Modal: Split Map Selector + WaypointList
```

---

## 7. Animation & Interaction Standards

- **Engine:** React Native Reanimated (v4.5).
- **Tactile Feedback:** Every pressable component (Card, Button, List Item) scales slightly (`0.96–0.98`) with spring physics (`damping: 15, stiffness: 300`).
- **Live Telemetry Transitions:** Metric numbers and progress indicators transition smoothly upon new poll payloads.
- **Layout Transitions:** Layout changes (e.g. waypoint deletion) use animated entering/exiting transitions.
