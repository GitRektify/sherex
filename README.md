# Sherex

## Getting Started

> **Note:** Before proceeding, ensure you have completed the [React Native Environment Setup](https://reactnative.dev/docs/environment-setup) up to the "Creating a new application" step.

### Prerequisites

* Node.js > v22.4.0
* npx > v10.8.2
* Xcode 12
* CocoaPods 1.15.2
* JDK > 11
* Android Studio and Android SDK

### Base Dependencies

* `axios` for networking
* `prop-types` for component property type-checking
* `dotenv` for environment management
* `react-navigation` for app navigation
* `react-native-localization` for string localization

---

## Installation & Setup

1. **Install dependencies**

   ```bash
   yarn install
   ```

2. **Create mocked Google service files**
   These files are required for a successful build. Run:

   ```bash
   chmod +x ./scripts/copy-sample-files.sh && ./scripts/copy-sample-files.sh
   ```

3. **Configure environment variables**
   Open `.env.debug` and replace `ENV_PROJECT_ID` with your [Cloud Project ID](https://cloud.reown.com/).

4. **Install CocoaPods dependencies (iOS only)**
   If using Xcode 12.5 or higher, run:

   ```bash
   cd ios && pod install --repo-update
   ```

---

## Running the Application

Open a new terminal from the root of your project and run:

* **Android**

  ```bash
  yarn android
  ```

* **iOS**

  ```bash
  yarn ios
  ```

  *(Alternatively, you can run directly from Xcode or Android Studio.)*

If everything is configured correctly, your app should launch on the Android emulator or iOS simulator.

---

## Building Production APK / IPA

* **Build production Android APK**

  ```bash
  yarn build-apk-prod
  ```

* **Build production iOS IPA**
  *(Add your iOS production build command here if different)*

---
