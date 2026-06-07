---
name: LocalAid tab routing
description: How role-adaptive tabs work; pitfalls with unstable Expo APIs.
---

## Rule
Use standard `Tabs` from `expo-router` with `href: null` to hide tabs that don't apply to the current role. Do NOT import from `expo-router/unstable-native-tabs` or `expo-glass-effect` — these APIs cause bundler errors in this project.

**Why:** Early scaffold used NativeTabs/liquid glass from unstable APIs. Replaced with classic Tabs + BlurView background for iOS blur effect. The unstable imports break the Metro bundler.

**How to apply:** In `app/(main)/_layout.tsx`, iterate over ALL_SCREENS and set `href: null` for screens not in the active role's tab list. The legacy `app/(tabs)/` folder stays but only contains redirects to `/(main)`.
