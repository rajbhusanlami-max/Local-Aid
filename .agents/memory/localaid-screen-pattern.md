---
name: LocalAid screen pattern
description: How tab routes and screen components are organized.
---

## Rule
Tab route files in `app/(main)/` are thin one-liners that delegate to role-specific components in `screens/`. This keeps routing logic separate from UI.

**Why:** Each tab may render a completely different screen depending on user role. Separating the delegate (route file) from the component (screen file) makes both easy to edit independently.

**How to apply:** Route file checks `user.role` via `useAuth()` and returns the matching screen component. Screen components import from `@/screens/<ScreenName>`. All heavy UI lives in `screens/`, not in `app/(main)/`.
