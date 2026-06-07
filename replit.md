# LocalAid

A community support mobile app connecting Citizens, Volunteers, NGO Admins, and Super Admins across Nepal. Built with Expo/React Native — frontend-only, no backend.

## Run & Operate

- `pnpm --filter @workspace/mobile run dev` — start the Expo dev server (Expo workflow)
- The Expo workflow is pre-configured and runs automatically

## Stack

- Expo SDK 53, Expo Router (file-based routing)
- React Native + TypeScript
- AsyncStorage (local persistence, no backend)
- expo-linear-gradient, expo-blur, expo-haptics
- @expo/vector-icons (Feather primary)
- react-native-reanimated, react-native-gesture-handler
- @expo-google-fonts/inter (Inter 400/500/600/700)

## Where things live

```
artifacts/mobile/
├── app/                      # Expo Router file-based routes
│   ├── _layout.tsx           # Root layout (fonts, providers, Stack)
│   ├── index.tsx             # Auth guard → redirect to /login or /(main)
│   ├── login.tsx             # Login screen with demo account chips
│   ├── register.tsx          # Registration screen
│   ├── onboarding.tsx        # First-run onboarding
│   ├── new-request.tsx       # 3-step help request form
│   ├── request/[id].tsx      # Request detail with timeline
│   ├── task/[id].tsx         # Task detail for volunteers
│   ├── campaign/[id].tsx     # Campaign detail
│   ├── (main)/               # Main tab group (role-adaptive tabs)
│   │   ├── _layout.tsx       # Tab layout — shows role-specific tabs
│   │   ├── index.tsx         # Home tab → delegates to role screen
│   │   ├── requests.tsx      # Requests tab
│   │   ├── campaigns.tsx     # Campaigns tab
│   │   ├── notifications.tsx # Notifications tab
│   │   ├── profile.tsx       # Profile tab
│   │   ├── tasks.tsx         # Volunteer tasks tab
│   │   ├── impact.tsx        # Volunteer impact tab
│   │   ├── leaderboard.tsx   # Volunteer leaderboard tab
│   │   ├── volunteers.tsx    # NGO volunteers tab
│   │   ├── users.tsx         # Admin users tab
│   │   ├── ngos.tsx          # Admin NGOs tab
│   │   └── analytics.tsx     # Admin analytics tab
│   └── (tabs)/               # Legacy folder, redirects to (main)
├── screens/                  # Role-specific screen components
│   ├── CitizenHome / CitizenRequests / CitizenCampaigns / CitizenProfile
│   ├── VolunteerHome / VolunteerTasks / VolunteerImpact / VolunteerLeaderboard / VolunteerProfile
│   ├── NgoHome / NgoRequestTriage / NgoCampaigns / NgoVolunteers / NgoProfile
│   ├── AdminHome / AdminUsers / AdminNgos / AdminAnalytics / AdminAllRequests / AdminProfile
│   └── NotificationsScreen
├── context/
│   ├── AuthContext.tsx        # Role-based auth, seed demo accounts
│   └── DataContext.tsx        # Mock requests/campaigns/volunteers/notifications
├── components/
│   ├── UI.tsx                 # Button, Card, Badge, Avatar, StatCard, EmptyState, UrgencyBar, TagChip, Skeleton, LoadingScreen, SectionHeader
│   ├── RequestCard.tsx        # Reusable request card
│   ├── TaskCard.tsx           # Reusable task card
│   └── ErrorBoundary.tsx      # Class-based error boundary
├── constants/colors.ts        # Design tokens (light + dark, primary #1A6B4A, accent #F07020)
└── hooks/useColors.ts         # Returns palette for current color scheme
```

## Architecture decisions

- **Frontend-only MVP**: All data in AsyncStorage + in-memory context. No backend required.
- **Role-adaptive tabs**: Single `(main)` group with `href: null` to hide irrelevant tabs per role. Tabs re-render on role change automatically.
- **Legacy (tabs) redirect**: Old scaffold `(tabs)` folder kept but redirects to `(main)` to avoid routing conflicts.
- **Screens directory pattern**: Tab routes are thin delegates; actual UI lives in `screens/` for easier iteration.
- **Color tokens**: All colors via `useColors()` hook, full dark mode support defined in `constants/colors.ts`.

## Product

Four roles, each with their own home experience:

- **Citizen** — submit help requests (food, medical, elder care, blood, etc.), track status, browse campaigns
- **Volunteer** — browse available tasks, accept assignments, track impact & hours, leaderboard
- **NGO Admin** — triage incoming requests, manage campaigns, oversee volunteer team
- **Super Admin** — platform overview, user management, NGO approvals, analytics

## Demo accounts (password: demo123)

| Role | Email |
|------|-------|
| Citizen | citizen@localaid.np |
| Volunteer | volunteer@localaid.np |
| NGO Admin | ngo@localaid.np |
| Super Admin | admin@localaid.np |

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Do NOT import from `expo-router/unstable-native-tabs` or `expo-glass-effect` — these APIs are unstable and may cause bundler errors. Use the standard `Tabs` from `expo-router` instead.
- `(tabs)` folder must stay (Expo Router requires all route files to be valid); it contains only redirects to `(main)`.
- All screens must handle `Platform.OS === "web"` for top padding: use `Platform.OS === "web" ? 67 : insets.top`.
- Tab bar is positioned `absolute`, so scroll views need `paddingBottom: insets.bottom + 100` to avoid content clipping.

## Pointers

- See the `expo` skill for Expo-specific patterns
- See the `pnpm-workspace` skill for workspace structure
