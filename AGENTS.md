# SHELLOC Mobile — Agent Context

## Source of Truth Matrix

| Question | Source of truth |
|---|---|
| What is SHELLOC Mobile? | [README.md](./README.md) |
| How is the app structured? | [docs/architecture.md](./docs/architecture.md) |
| What navigation routes exist? | [docs/navigation-and-routes.md](./docs/navigation-and-routes.md) |
| What design tokens & component specs exist? | [docs/design-system.md](./docs/design-system.md) |
| How does data & state flow? | [docs/state-and-data-flow.md](./docs/state-and-data-flow.md) |

## Core Operational Rules

1. **Navigation Architecture:** Maintain the **4-view unified bottom tab layout**:
   - `Home` (`/(tabs)/index`)
   - `Diagnostics` (`/(tabs)/diagnostics`)
   - `AI Chat` (`/(tabs)/chat`)
   - `Feedback Display / Activity Log` (`/(tabs)/activity`)
2. **AI Provider:** Dedicated to Google Gemini (`gemini-3.7-flash`).
3. **Closed-Loop Support:** Reflect the 9-state lifecycle, 15-minute incubation countdown, dual reagents (Moringa-Chitosan + Citric Acid), and buoyancy failsafe alerts.
4. **NativeWind v4 Styling Safety Rule:** Never use Tailwind opacity modifiers (`/n`) inside dynamic `className` expressions. Move opacity to an inline `style` prop (e.g. `style={{ shadowColor: '#00F2FE', shadowOpacity: 0.4 }}`).
