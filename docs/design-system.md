# Design System & Component Spec

This document defines the visual grammar and reusable UI components for the SHELLOC Mobile App.

The design language targets an **approachable consumer health/fitness app** aesthetic (e.g., Apple Health, Oura), avoiding a rigid "industrial dashboard" feel. It uses card-based layouts, soft shadows, rounded corners, and pastel accents.

## 1. Design Tokens (NativeWind / Tailwind)

These tokens are configured in `tailwind.config.js` and serve as the foundation for all UI styling.

### Color Palette

- **Backgrounds & Surfaces**
  - `background` (`#E9E8F2`): Soft lavender-gray, used for the main app background.
  - `surface` (`#FFFFFF`): Primary card/white surface.
  - `surfaceMuted` (`#F4F4F5`): Secondary card background or inactive states.
- **Typography**
  - `ink` (`#111111`): Primary text (high contrast).
  - `inkMuted` (`#6B6B76`): Secondary text, labels, and timestamps.
- **Data Categories (Pastel Accents)**
  - `coral` (`#F4A99C`): Turbidity / Alert category.
  - `periwinkle` (`#ADA3E3`): Progress / Overview category.
  - `mint` (`#A3D9C9`): pH / Stable-state category.
  - `peach` (`#F4C99B`): TDS / Warning category.
- **Status Indicators (Mapping to Backend Logic)**
  - `leaf` (`#5CBB79`): Good / Acceptable status.
  - `amber` (`#F2B84C`): Borderline / Warning status.
  - `danger` (`#E76A54`): Critical / Error status.
  - `rose` (`#F0A79E`): High-severity critical state (alternative to danger).
- **Brand & Action**
  - `sky` (`#4F91D6`): Primary buttons, links, active tab indicators.

### Typography Scale

A clean, modern sans-serif typeface should be used.
- **Font Family:** **Inter** (via `@expo-google-fonts/inter`), falling back to system sans-serif (`SF Pro Text` on iOS, `Roboto` on Android) for clean, readable, consumer health aesthetics.
- **Icon Set:** **Lucide React Native** (`lucide-react-native`) for 100% consistent cross-platform vector iconography.
- **Heading 1:** 28px, Bold (e.g., Screen Titles)
- **Heading 2:** 22px, SemiBold (e.g., Section Headers)
- **Heading 3:** 18px, Medium (e.g., Card Titles)
- **Body:** 16px, Regular (e.g., Chat text, descriptions)
- **Label:** 14px, Medium (e.g., Tab labels, small buttons)
- **Caption:** 12px, Regular (e.g., Timestamps, minor notes)

### Spacing & Radii Scale

- **Spacing:** standard Tailwind scale (e.g., `p-4` for 16px, `p-6` for 24px).
- **Radii:** Generous rounded corners.
  - Cards: `rounded-2xl` (16px) or `rounded-3xl` (24px).
  - Buttons: `rounded-full` (pill shape).

## 2. Core Component Specifications

All UI components should live in `src/components/core/` or `src/components/domain/`.

### `Card`
- **Visuals:** White surface (`bg-surface`), generous radius (`rounded-3xl`), soft drop shadow (`shadow-sm` or custom soft shadow).
- **Props:** `children`, `style`, `onPress` (if interactive).
- **Accessibility:** If interactive, needs `accessibilityRole="button"`.

### `Button`
- **Variants:** `primary` (bg-sky, text-white), `secondary` (bg-surfaceMuted, text-ink), `outline` (border-sky, text-sky).
- **Visuals:** Pill-shaped (`rounded-full`), minimum touch target size 44x44 points.
- **Accessibility:** Must have `accessibilityLabel`.

### `StatCard` (Domain)
- **Purpose:** Displays a single telemetry metric (e.g., Turbidity).
- **Visuals:** Uses a pastel accent background (e.g., `bg-coral/10`) or an accent icon. Features a prominent numerical value and a status indicator (dot or badge).
- **Props:** `title`, `value`, `unit`, `status` (leaf | amber | danger), `icon`.

### `ProgressRing` / `Sparkline` (Domain)
- **Purpose:** Visualizing data trends, similar to fitness rings.
- **Tech:** Use React Native SVG and Reanimated for drawing and animating the paths.
- **Props:** `value` (0-100), `color` (tailwind token), `strokeWidth`.

### `StatusHeader`
- **Purpose:** Top-of-screen indicator showing global robot connection status (Connected, Offline, Cleaning).
- **Visuals:** Uses `leaf`, `amber`, `danger`, or `inkMuted` (no data/offline) to provide immediate context.

### `Badge`
- **Purpose:** Small tag for status or categories.
- **Visuals:** `rounded-full`, padding `px-2 py-1`, muted background with solid text.

## 3. Animation Standards

Animations should feel fluid, responsive, and physical.
- **Library:** React Native Reanimated.
- **Micro-interactions:** Buttons and touchable Cards should slightly scale down on press (`useAnimatedStyle` with `withSpring`).
- **Data Transitions:** When a telemetry value changes (e.g., pH drops), the `ProgressRing` or `StatCard` number should animate smoothly to the new value, not snap instantly.
- **Layout Animations:** Use Reanimated's `Layout` (e.g., `LinearTransition`) when lists change or cards expand/collapse.
