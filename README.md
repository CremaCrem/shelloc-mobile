# SHELLOC Mobile App

This is the React Native (Expo) companion application for the SHELLOC autonomous water-remediation robot.

## 📖 Architecture & Documentation

To understand how this app is structured, styled, and integrated with the backend and hardware, please read the documentation blueprints located in the `docs/` folder:

1. **[Architecture Overview](docs/architecture.md)** – Tech stack, layer separation, and folder structure.
2. **[Design System & Components](docs/design-system.md)** – Tokens, colors, typography, and core UI components.
3. **[State & Data Flow](docs/state-and-data-flow.md)** – Local/Global state, API mapping, and real-time telemetry logic.
4. **[Navigation & Routing](docs/navigation-and-routes.md)** – Expo Router screen tree, route guards, and deep linking.
5. **[Development & DevOps Guide](docs/development-guide.md)** – macOS setup, Xcode requirements, and EAS build pipelines.

*(Before writing any code or components, please familiarize yourself with these guidelines to ensure consistency.)*

---

## 🚀 Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npx expo start
   ```

3. **Run on iOS (Simulator)**
   ```bash
   npx expo start --ios
   ```

*Refer to [docs/development-guide.md](docs/development-guide.md) for detailed instructions on testing with physical devices or deploying builds.*
