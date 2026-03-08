# ThePuck — Companion App

## What we're building

A full-featured health companion web app for the ThePuck wearable sensor.  
The overall palette is a **very light, cool grey** background with:

- Background: pale cool grey to light blue‑grey gradient
- Form fields: white or near‑white with very light grey borders
- Primary button: muted slate blue / desaturated steel blue
- Text: dark charcoal grey for headings, mid‑grey for body copy
- Accents (avatars, badge): small pops of warm yellow/gold and skin tones   
Responsive — works beautifully on mobile and desktop. Backed by Supabase for auth, user profiles, and health data persistence.  
Similar website UX to Apple

---

## Architecture

### Pages / Routes


| Route         | Screen                       |
| ------------- | ---------------------------- |
| `/onboarding` | Pairing wizard (3 steps)     |
| `/`           | Home / Today dashboard       |
| `/stress`     | Stress & Readiness deep-dive |
| `/heart`      | Heart Rate & Activity        |
| `/sleep`      | Sleep Quality                |
| `/gestures`   | Gestures & Haptics config    |
| `/find`       | Find My Puck/Watch           |
| `/settings`   | Device & Account Settings    |


### Navigation

- **Mobile**: bottom tab bar (5 tabs: Today, Stress, Heart, Sleep, Settings) with side-drawer for secondary screens
- **Desktop**: persistent left sidebar with full labels

### Global State (Zustand)

```
deviceStore: { batteryLevel, connectionState, firmwareVersion, lastSeen }
healthStore: { heartRate, hrv, stressScore, readinessScore, steps, calories, distance, activeMins, sleepData }
gestureStore: { gestures[], hapticProfiles[] }
userStore: { profile, subscription, privacySettings }
```

### Supabase Schema

- `profiles` — user bio data (name, age, units preference)
- `health_readings` — timestamped HR, HRV, stress, steps, calories, sleep
- `gesture_configs` — user gesture mappings
- `haptic_profiles` — vibration pattern preferences
- `device_info` — paired device metadata (battery, firmware, last location)

---

## Design System

### Color tokens (CSS variables)

- `--bg`: `#05070A` (main background)
- `--surface`: `#0C0F14` (cards)
- `--border`: `#111827`
- `--text-primary`: `#F5F5F7`
- `--text-secondary`: `#9CA3AF`
- `--text-muted`: `#4B5563`
- `--teal`: `#1BC4A3` (primary accent)
- `--gold`: `#C89B3C` (luxury accent — strokes & icons only)
- `--green`: `#4ADE80`, `--amber`: `#F59E0B`, `--red`: `#F97373`

### Shared Components

- `Screen` — full-height container with safe-area padding
- `Card` — dark surface with 1px border, rounded-xl
- `MetricRing` — SVG arc ring (used for readiness & stress)
- `MetricChip` — small pill with icon + value
- `SectionHeader` — label + optional action link
- `PrimaryButton` — teal filled CTA
- `GhostButton` — ghost/outline variant
- `StatBar` — horizontal progress bar (activity)
- `SparkLine` — mini recharts line chart for inline trends

---

## Screens in Detail

### 1. Onboarding & Pairing (3 steps)

- Step 1: Welcome splash with puck icon, brand copy
- Step 2: Simulated BLE scan animation → "Puck found" confirmation
- Step 3: Profile setup (name, age, unit preference) → writes to `profiles` table

### 2. Home / Today Dashboard

- Status bar: battery pill, connection badge, time
- **Readiness Ring** — gold stroke SVG ring, score large, sub-label
- Row of **MetricChips**: Live HR (teal pulse), Stress score, HRV
- **Activity bar row**: Steps, Calories, Distance, Active mins (with daily goal bars)
- **Stress timeline**: recharts area chart, last 24h (teal fill, amber/red zones)
- **Sleep summary card**: last night's score + duration
- **Device card**: battery %, firmware, connection state

### 3. Stress & Readiness

- Large readiness score + breakdown (HRV quality, resting HR, sleep, recovery)
- Stress timeline recharts chart (day / week / month tabs)
- HRV trend chart
- "Mark stress now" button → writes a manual stress event

### 4. Heart & Activity

- Live HR display with animated pulse indicator
- HR trend chart (recharts LineChart, 24h)
- HR zone breakdown (resting, fat burn, cardio, peak) — horizontal bar
- Activity metrics: steps ring + calories ring + distance + active minutes cards
- Weekly activity summary chart

### 5. Sleep (scaffolded)

- Sleep score card with gold ring
- Sleep stage bar (Deep / Light / REM / Awake)
- Weekly sleep trend chart

### 6. Gestures & Haptics

- Gesture list: each row shows gesture type (double-tap, tilt, press-hold) → assigned action (call accept/reject, music control, stress mark)
- Haptic profiles: cards for Alert, Stress Warning, Readiness Nudge, Call Incoming — with intensity slider per profile

### 7. Find My Puck/Watch

- Proximity ring animation (simulated signal strength)
- Last seen timestamp + simulated map pin
- "Ring puck" button (triggers haptic on device)

### 8. Device & Account Settings

- Device info section (firmware, model, serial)
- Account: name, email, units
- Privacy toggles: data sharing, analytics opt-in
- Data controls: Export data button, Delete all data (destructive confirm)
- Subscription badge

---

## Data Layer

- Supabase auth (email/password) with protected routes
- `profiles` auto-created on signup via trigger
- Realistic mock data seeded into `health_readings` on first login (7 days of HR, HRV, sleep, steps)
- `useHealthData` hook reads from Supabase and simulates real-time HR updates via a 3-second interval
- `useDevice` hook manages BLE connection state simulation + battery polling

---

## How to Extend Later

- **New biomarkers**: Add a column to `health_readings`, create a new `MetricChip` + chart card, add to the store — no redesign needed
- **Premium features**: `userStore.subscription` flag gates advanced charts and export behind a `<PremiumGate>` wrapper component
- **Localization**: All strings extracted to a `locale/` directory with a `useTranslation` hook; date/unit formatting centralized in `lib/units.ts`