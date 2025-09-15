# CoTrip – Team Frame8

A cross-platform travel planning prototype built for the University of Queensland DECO3500 course. The repository contains a mobile-friendly React web app and a Kotlin-based Android app that explore a collaborative "CoTrip" experience: discovering destinations, planning itineraries with friends, and sharing feedback about places around Brisbane.

## Key Features
- Trip discovery deck (`web-app/src/components/DestinationSelection.js`) that pulls hotels, restaurants, and attractions from the Google Places API, falls back to curated mock data, and lets travellers swipe to shortlist or dismiss ideas.
- Personal journey board (`web-app/src/components/Myjourney.js`) that groups saved places by day, keeps items in `localStorage`, and offers a dedicated Google Maps view with cached geocoding (`JourneyMap.js`).
- Destination details & reviews (`DestinationDetail.js`, `CommentPage.js`) with image galleries, visit tips, rating capture, anonymous posting toggle, and optional photo uploads.
- Android Compose client (`app/src/main/java/com/example/myapplication`) with a Material 3 bottom navigation layout, Compose-first home screen, and an activity bridge that launches the Java-based swipe interface.
- Shared design language: mobile-first layouts, floating action buttons, and bottom navigation (`BottomNav.js`) to mirror native app conventions.

## Repository Layout
```
.
├── README.md                # Project overview (this file)
├── web-app/                 # React (Create React App) implementation
│   ├── src/components/      # Feature screens and UI building blocks
│   └── public/              # Static assets served by CRA
├── app/                     # Android application module
│   ├── src/main/java/       # Compose UI, navigation, swipe activity
│   └── src/main/res/        # Layouts, drawables, themes
├── gradle/                  # Gradle version catalog
├── build.gradle.kts         # Root Gradle configuration
└── package-lock.json        # Node dependency lockfile for the web app
```

## Prerequisites
- Node.js 18+ and npm (for the React front end).
- Android Studio Ladybug or later with Android SDK 36 and JDK 11 (for the Android module).
- Valid Google Places and Google Maps API keys if you want live data (the prototype includes placeholders that should be replaced before sharing builds).

## Web App (React)
1. Install dependencies:
   ```bash
   cd web-app
   npm install
   ```
2. Provide API keys. For local development create a `.env.local` file:
   ```
   REACT_APP_GOOGLE_PLACES_API_KEY=your_places_key
   REACT_APP_GOOGLE_MAPS_API_KEY=your_maps_key
   ```
   Then update `DestinationSelection.js` and `JourneyMap.js` to read from the environment (replace the hard-coded constants supplied for prototyping). The journey timeline expects browser `localStorage`, so the app must run in a standard browser context.
3. Start the development server:
   ```bash
   npm start
   ```
   CRA serves the app on `http://localhost:3000` with hot reloading.
4. Run tests or create a production build when needed:
   ```bash
   npm test
   npm run build
   ```

### Prototype Data Flow
- Swiping right on a card records the place under `localStorage` key `frame8.myJourney.v1`; dislikes are stored in `frame8.votes.v1`.
- `JourneyMap.js` geocodes saved addresses and caches coordinates for 15 minutes under `frame8.mapGeocodeCache.v1` to reduce Google Maps API traffic.
- When the Places API is unavailable, the web app automatically falls back to in-repo mock destination data so flows stay testable offline.

## Android App
1. Open the project root in Android Studio and select the `app` module.
2. Sync Gradle (uses version catalogs in `gradle/libs.versions.toml`) and let Android Studio download dependencies.
3. Run the Compose application on an emulator or device using the `app` configuration. The bottom navigation is defined in `AppRoot.kt`; selecting "Create plan" bridges to the `DestinationSelection` swiping activity implemented in Java.
4. Command-line builds and tests:
   ```bash
   ./gradlew :app:assembleDebug
   ./gradlew :app:test
   ```

The Android experience mixes Jetpack Compose for the main shell with a traditional activity and XML layout (`res/layout/destination_selection.xml`) to support gesture-based card interactions. Animations, gesture thresholds, and sample data live inside `DestinationSelection.java`.

## Working With Google APIs
- Enable the Places API and Maps JavaScript API for your Google Cloud project, then restrict the keys to your development domains/package names.
- Replace the placeholder keys stored in the components before publishing or open-sourcing builds. Keeping keys in environment variables prevents accidental leaking in version control.
- Rate limits are easy to hit during development; the local caching strategy (15-minute geocode cache and local mock fallback) helps minimise calls.

## Recommended Workflow
- Prototype in the React app first to iterate on copy/design, then port validated flows into Compose if they make sense for the native client.
- When changing storage formats in the web app, also update the key readers in `JourneyMap.js` and `Myjourney.js` to keep the map timeline consistent.
- Run `npm test` and `./gradlew lint` (Android Studio > Analyze > Inspect Code) before sharing builds with the rest of the team.

---

This README should give new contributors enough context to spin up either client, understand the cross-platform feature set, and plug in their own API credentials. Reach out to the Frame8 team if you need access to design files or additional documentation.
