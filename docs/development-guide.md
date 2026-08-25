# Development & DevOps Guide

This guide covers everything needed to set up, build, and deploy the SHELLOC Mobile app on macOS. It is specifically tailored to help developers new to React Native and iOS development avoid common pitfalls.

## 1. Local Environment Setup (macOS)

### Prerequisites
1. **Node.js**: Install via NVM (`nvm install --lts`) or Homebrew (`brew install node`).
2. **Watchman**: File watching service by Meta. `brew install watchman`.
3. **Expo CLI**: Installed locally as part of the project dependencies (`npx expo`).

### IDE Configuration
- **Editor**: VS Code is recommended.
- **Extensions**: Install `ESLint`, `Prettier - Code formatter`, and `Tailwind CSS IntelliSense`.
- **Formatting**: Uses standard Expo ESLint (`eslint-config-expo`) and Prettier (`printWidth: 100`, `singleQuote: true`, `trailingComma: 'es5'`). Ensure your editor is set to "Format on Save".
- **TypeScript**: The project is strictly typed. Do not bypass the compiler with `@ts-ignore` unless absolutely necessary.

## 2. Running on iOS: The Beginner's Guide

Developing for iOS requires Apple-specific tooling, but Expo significantly lowers the barrier to entry.

### Do I need Xcode?
**Yes, for local simulator testing.**
- Download **Xcode** from the Mac App Store (it is a massive >10GB download, so start early).
- Once installed, open it, agree to the terms, and install the "iOS Simulator" components when prompted.
- You do *not* need to open Xcode for daily development. You simply need its command-line tools and simulator installed.

### Do I need an Apple Developer Account ($99/year)?
**Not immediately.**
- **Local Simulator:** Completely free. No account required.
- **Expo Go (Physical Device Testing):** Completely free. Download the Expo Go app from the App Store on your iPhone.
- **When do you need to pay?** You only need the $99/year enrollment when you want to build a standalone `.ipa` file to install on real devices (via TestFlight) or when publishing to the iOS App Store.

### Running the App Locally
1. Run `npm install`
2. Run `npm run ios` (or `npx expo start --ios`)
   - This command will automatically boot up the iOS Simulator and load the app.
   - To test on your physical iPhone, simply run `npx expo start`, open the Camera app on your iPhone, and scan the QR code.

## 3. Building & Deployment (EAS)

Building native iOS/Android apps locally on your laptop is notoriously difficult due to certificate management, native code compilation, and dependency conflicts. 

We avoid this entirely by using **EAS (Expo Application Services)**. EAS builds your app in the cloud.

### EAS Build Profiles (`eas.json`)

The project utilizes three distinct build profiles:

1. **Development (`development`)**
   - **Purpose:** Creates a "Development Build" (a custom version of Expo Go that includes our specific native modules like Reanimated or third-party SDKs).
   - **Distribution:** Internal team only.

2. **Preview (`preview`)**
   - **Purpose:** Creates a production-like build for QA and stakeholder testing, without submitting to the App Store.
   - **Distribution:** Internal distribution to physical devices.

3. **Production (`production`)**
   - **Purpose:** The final build submitted to TestFlight and the App Store.
   - **Distribution:** Public (TestFlight / App Store).

### How to Build (The EAS Way)
1. Install EAS CLI: `npm install -g eas-cli`
2. Login: `eas login`
3. Run a build: `eas build --profile preview --platform ios`
   - EAS will handle all the Apple certificate provisioning behind the scenes.
   - It will output a link to download and install the app directly to your phone.

### EAS Submit
When you are ready to ship to TestFlight or the App Store (requires the $99 Apple Developer Program):
- Run `eas submit -p ios`
- EAS will take your latest cloud build and automatically upload it to Apple App Store Connect, bypassing the need to ever open Xcode to submit an archive.

## 4. Cross-Platform Compatibility (iOS & Android)

SHELLOC Mobile is a cross-platform React Native application. When developing new features, always ensure they are fully compatible across both iOS and Android.

### Critical Considerations for Android
1. **Network & Cleartext Traffic:**
   - **Localhost:** On the iOS Simulator, `http://localhost:8000` points to the Mac host. On the Android Emulator, `localhost` points to the Android device itself. You must use `http://10.0.2.2:8000` to reach the Mac host from the Android Emulator. Physical devices (both iOS and Android) require the Mac's LAN IP (e.g. `http://192.168.1.x:8000`).
   - **Cleartext Traffic:** Android 9+ blocks unencrypted HTTP traffic by default. We have configured `"usesCleartextTraffic": true` in `app.json` to allow local HTTP testing. Production APIs must always use HTTPS.
2. **Navigation & Safe Areas:**
   - **System Navigation Bar:** Android devices often use a 3-button navigation bar at the bottom of the screen. Avoid hardcoding fixed heights for bottom tab bars. Always use dynamic insets (e.g., `useSafeAreaInsets().bottom`) to prevent UI overlap with the navigation buttons.
   - **Double Padding:** When wrapping tab screens in `<SafeAreaView>`, always specify `edges={['top']}`. Otherwise, you will generate "double bottom padding" because the bottom tab navigator already accounts for the bottom safe area.
3. **Google Maps API Key:**
   - While `react-native-maps` uses Apple Maps on iOS out-of-the-box, it requires Google Play Services on Android.
   - For standalone Android builds (APK/AAB), you **must** configure a valid Google Maps API Key in `app.json` under `android.config.googleMaps.apiKey`. Without this, the map will render as a blank grid or crash.
4. **Keyboard Handling:**
   - Android natively handles keyboard resizing (`windowSoftInputMode="adjustResize"`). iOS does not.
   - Use `<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>` to ensure uniform cross-platform behavior. Do not apply `behavior="padding"` unconditionally, as it will cause double-height visual glitches on Android.
5. **Text & Flexbox Wrapping:**
   - Be mindful of narrow Android screens (e.g., 360dp width). Always utilize `flex-shrink` within tight rows (like `StatusHeader`) to prevent text and badges from being clipped or pushed off-screen.
   - `numberOfLines={1}` and `adjustsFontSizeToFit={true}` should be used on metric badges to allow them to scale down gracefully.
