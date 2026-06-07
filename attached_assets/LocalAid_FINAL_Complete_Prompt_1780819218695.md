# LocalAid — FINAL COMPLETE VIBE-CODE PROMPT
> **Student:** Bhusan Raj Lamichhane (NP069589 · NP3F2509IT)
> **Degree:** BSc (Hons) Information Technology — Asia Pacific University / LBEF College
> **Supervisors:** Suman Dhital · Umesh Kisor Baral
> **Stack:** React PWA · Firebase · Gemini AI · GitHub · Vercel
> **Version:** FINAL — All frontend, backend, AI, security, and DevOps combined

---

## SECTION 1 — PROJECT OVERVIEW

Build **LocalAid** — a cross-platform, mobile-first **Progressive Web Application (PWA)** that coordinates social-support services between four stakeholder roles: **Citizens**, **Volunteers**, **NGO Admins**, and **Super Admin (Local Government)**. One web codebase. Every device. No native app required.

**Tagline:** *"Connecting communities, one request at a time."*

**SDG Alignment:**
- SDG 3 — Good Health and Well-being
- SDG 11 — Sustainable Cities and Communities
- SDG 17 — Partnerships for the Goals

---

## SECTION 2 — FULL TECH STACK

### Frontend
| Layer | Technology |
|---|---|
| Framework | React 18 + Vite (PWA via `vite-plugin-pwa`) |
| Styling | Tailwind CSS v3 + shadcn/ui |
| State | Zustand (global auth/UI) + React Query v5 (server state) |
| Routing | React Router v6 (lazy-loaded routes) |
| Animations | Framer Motion |
| Icons | Lucide React |
| Charts | Recharts |
| Maps | Google Maps JS API (Places + Maps JavaScript API) |
| Forms | React Hook Form + Zod validation |
| PDF Export | jsPDF + html2canvas |
| Image Compress | browser-image-compression (client-side before upload) |
| PWA | Service Worker, Web App Manifest, offline cache, install prompt |
| Accessibility | ARIA labels, keyboard navigation, focus management |
| i18n | i18next + react-i18next (English + Nepali) |

### Backend-as-a-Service (Firebase)
| Layer | Technology |
|---|---|
| Auth | Firebase Authentication (email/password + Google OAuth) |
| Database | Firebase Firestore (NoSQL, real-time listeners) |
| Storage | Firebase Storage (avatars, request photos, certificates) |
| Functions | Firebase Cloud Functions v2 (Node 20, scheduled + triggered) |
| Messaging | Firebase Cloud Messaging (FCM) — web push notifications |
| Hosting | Firebase Hosting (fallback) + Vercel (primary) |

### AI — Gemini API
| Use | Model |
|---|---|
| All real-time features (categoriser, chatbot, matching) | `gemini-1.5-flash` |
| Weekly digest + sentiment analysis | `gemini-1.5-pro` |

### DevOps
| Layer | Technology |
|---|---|
| Version Control | GitHub |
| CI/CD | GitHub Actions → Vercel auto-deploy |
| Preview Deploys | Vercel branch previews on every PR |
| Secrets | `.env.local` locally; Vercel + GitHub Secrets in CI |

---

## SECTION 3 — ENVIRONMENT VARIABLES

### `.env.local` (never commit this file)
```env
# Firebase
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=yourproject.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=yourproject.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_FIREBASE_VAPID_KEY=your_fcm_vapid_key

# AI
VITE_GEMINI_API_KEY=your_gemini_key

# Maps
VITE_GOOGLE_MAPS_API_KEY=your_maps_key

# App
VITE_APP_URL=http://localhost:5173
VITE_APP_NAME=LocalAid
```

### `.env.example` (commit this — no real values)
Copy `.env.local` structure above with `=your_value_here` placeholders.

### Functions environment (set via Firebase CLI)
```bash
firebase functions:config:set gemini.key="YOUR_KEY" app.url="https://localaid.vercel.app"
```

---

## SECTION 4 — USER ROLES & COMPLETE PERMISSIONS

### 4.1 Citizen
- Register with email verification → Login → Forgot password
- First-time onboarding walkthrough (3 slides explaining the app)
- Submit support requests (multi-step form with draft auto-save)
- Attach photos to requests (compressed client-side, max 5MB each, max 3 photos)
- Track request status in real-time with full timeline log
- Receive push notifications on all status changes
- Rate + write review for volunteer after request is completed
- View NGO public profiles and active campaigns
- Join/register for public campaigns as a participant
- Report abusive content or fake requests
- View map of nearby active campaigns (pin map)
- AI chatbot always available for guidance and support
- Manage notification preferences in profile
- Switch language (English / Nepali)
- Delete account (soft-delete — data anonymised)

### 4.2 Volunteer
- Register → Email verification → Skill profile setup (onboarding)
- Volunteer background check flag (NGO marks `isVerified: true`)
- Set weekly availability schedule (days + time slots)
- Set service radius (km from their location)
- Browse AI-ranked assigned tasks + optional open task pool
- Accept or decline tasks (decline requires a reason)
- Check-in (GPS-confirm on-site arrival) + check-out on completion
- Update task status: Pending → In Progress → Completed → Needs Help
- Add completion notes + optional photo proof
- Receive AI-suggested status nudge if no update in 4h
- View personal impact dashboard (tasks done, hours, people helped)
- Download/share volunteer certificate (PDF, auto-generated on milestone)
- Public volunteer profile with badge display
- Volunteer leaderboard position
- Manage availability, skills, and notification preferences

### 4.3 NGO Admin
- Register NGO → Super Admin approval required before activation
- Manage NGO public profile (name, description, logo, contact, coverage area)
- Review + triage incoming citizen requests (AI-assisted)
- Assign/reassign volunteers to requests
- Verify volunteers in their roster (`isVerified` flag)
- Create, edit, publish, archive campaigns and events
- AI campaign content generator (type goal → get full campaign)
- Manage campaign participant list (citizens who joined)
- Generate volunteer recruitment messages (WhatsApp/social media)
- Track event attendance and volunteer check-ins
- View NGO-scoped analytics dashboard with export (PDF/CSV)
- Receive daily summary email of NGO activity
- Bulk-assign volunteers to multiple tasks
- Report and flag problematic requests

### 4.4 Super Admin (Local Government)
- Full platform access — all data, all roles
- Approve or reject NGO registration requests
- CRUD on all users (view, edit role, deactivate, ban)
- Bulk actions on users table (bulk deactivate, bulk role-change)
- Platform-wide analytics dashboard with all charts
- View AI-generated weekly impact digest (auto Monday 8AM)
- Receive AI anomaly alerts (spikes, capacity issues, inactive NGOs)
- Resource allocation recommendations across NGOs
- View full audit log (every admin action timestamped)
- Configure platform settings (categories, urgency definitions, regions)
- Export any dataset as CSV or PDF
- Manage system notifications (broadcast messages to all users)
- Monitor Gemini API usage + costs estimate panel

---

## SECTION 5 — COMPLETE FIRESTORE DATA SCHEMA

```
/users/{uid}
  name: string
  email: string
  role: 'citizen' | 'volunteer' | 'ngo' | 'superadmin'
  avatar: string (Storage URL)
  phone: string (optional)
  location: { lat, lng, address, district }
  language: 'en' | 'ne'
  isActive: boolean
  isVerified: boolean (email verified)
  isBanned: boolean
  createdAt: timestamp
  lastLoginAt: timestamp
  fcmToken: string (for push notifications)
  notificationPrefs: {
    statusUpdates: boolean
    newAssignments: boolean
    campaigns: boolean
    digest: boolean
  }

/citizens/{uid}  (extends users)
  totalRequestsSubmitted: number
  openRequestIds: string[]
  completedRequestIds: string[]
  averageRatingGiven: number

/volunteers/{uid}  (extends users)
  skills: string[]
  availabilitySchedule: { mon:[], tue:[], wed:[], thu:[], fri:[], sat:[], sun:[] }
  serviceRadiusKm: number
  isVerifiedByNGO: boolean
  verifiedByNgoId: string
  activeTaskIds: string[]
  completedTaskCount: number
  totalHoursContributed: number
  rating: number
  reviewCount: number
  badges: string[]
  leaderboardScore: number

/ngos/{ngoId}
  name: string
  description: string
  logo: string (Storage URL)
  adminId: string (uid)
  contactEmail: string
  contactPhone: string
  coverageAreas: string[]
  approvalStatus: 'pending' | 'approved' | 'rejected'
  approvedBy: string (superadmin uid)
  approvedAt: timestamp
  volunteers: string[] (uids)
  activeCampaignIds: string[]
  totalRequestsHandled: number
  createdAt: timestamp
  isActive: boolean

/requests/{requestId}
  citizenId: string
  title: string
  description: string
  category: 'elderly_care' | 'emergency' | 'blood_donation' | 'welfare' |
            'food' | 'medical' | 'shelter' | 'education' | 'other'
  subTags: string[]
  bloodType: string (only for blood_donation category)
  urgency: 1 | 2 | 3 | 4 | 5
  urgencyLabel: string
  status: 'submitted' | 'accepted' | 'in_progress' | 'completed' | 'cancelled'
  cancelReason: string
  location: { lat: number, lng: number, address: string, district: string, landmark: string }
  photos: string[] (Storage URLs, max 3)
  assignedVolunteerId: string | null
  assignedNgoId: string | null
  timeline: [{ status, timestamp, actorId, actorRole, note }]
  citizenRating: number | null (1-5, set after completion)
  citizenReview: string | null
  aiCategory: string
  aiSubTags: string[]
  aiUrgencyScore: number
  aiConfidence: number
  aiEscalated: boolean
  matchedVolunteerIds: string[] (ranked by AI, top 3)
  isDuplicate: boolean
  reportedBy: string[] (uids)
  createdAt: timestamp
  updatedAt: timestamp
  completedAt: timestamp | null
  acceptedAt: timestamp | null
  expiresAt: timestamp (24h after submitted if unaccepted → reassign)

/campaigns/{campaignId}
  ngoId: string
  title: string
  description: string
  tags: string[]
  eventDate: timestamp
  endDate: timestamp
  location: { address, lat, lng }
  volunteerRoles: [{ role, skills, count, filledCount }]
  maxVolunteers: number
  registeredVolunteerIds: string[]
  participantCitizenIds: string[]
  status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled'
  isAIGenerated: boolean
  aiGeneratedContent: object (raw Gemini output saved)
  attendanceLog: [{ userId, checkinTime, checkoutTime }]
  createdAt: timestamp
  updatedAt: timestamp

/feedback/{feedbackId}
  requestId: string
  citizenId: string
  volunteerId: string
  rating: number (1-5)
  review: string
  tags: string[] (e.g. 'punctual', 'kind', 'skilled')
  createdAt: timestamp
  aiSentiment: 'positive' | 'neutral' | 'negative'
  aiSentimentScore: number

/notifications/{notificationId}
  userId: string
  type: 'request_accepted' | 'task_assigned' | 'status_update' | 'new_campaign' |
        'weekly_digest' | 'volunteer_matched' | 'request_completed' | 'system_alert' |
        'ngo_approved' | 'certificate_ready'
  title: string
  message: string
  read: boolean
  relatedId: string (requestId / campaignId / userId)
  relatedType: string
  deepLink: string (relative URL to navigate to)
  createdAt: timestamp

/volunteerCheckins/{checkinId}
  volunteerId: string
  requestId: string
  type: 'checkin' | 'checkout'
  location: { lat, lng }
  timestamp: timestamp
  distanceFromRequest: number (metres)

/auditLogs/{logId}
  actorId: string
  actorRole: string
  action: string (e.g. 'USER_BANNED', 'NGO_APPROVED', 'REQUEST_ESCALATED')
  targetId: string
  targetType: string
  before: object (snapshot)
  after: object (snapshot)
  ipAddress: string
  timestamp: timestamp

/reportedContent/{reportId}
  reporterId: string
  contentId: string
  contentType: 'request' | 'review' | 'campaign' | 'user'
  reason: string
  status: 'pending' | 'reviewed' | 'actioned' | 'dismissed'
  reviewedBy: string
  createdAt: timestamp

/drafts/{draftId}
  userId: string
  type: 'request' | 'campaign'
  data: object (partial form data)
  updatedAt: timestamp

/analytics/{period}  (period = 'weekly_YYYY-WW' or 'monthly_YYYY-MM')
  totalRequests: number
  resolvedRequests: number
  pendingRequests: number
  cancelledRequests: number
  avgResolutionHours: number
  volunteerHoursTotal: number
  newCitizens: number
  newVolunteers: number
  activeNGOs: number
  topCategories: [{ category, count }]
  topDistricts: [{ district, count }]
  avgCitizenRating: number
  aiSummary: string (Gemini narrative)
  generatedAt: timestamp
```

---

## SECTION 6 — ALL APPLICATION ROUTES

```
PUBLIC
  /                         Landing page
  /login                    Login (all roles)
  /register                 Register + role selection
  /register/verify-email    Email verification pending screen
  /forgot-password          Forgot password form
  /reset-password           Reset password (from email link)
  /ngo/:ngoId               NGO public profile page
  /volunteer/:uid           Volunteer public profile + badges
  /offline                  PWA offline fallback page
  /404                      Not found

CITIZEN  /citizen/*
  /citizen/onboarding       First-time walkthrough (3 steps)
  /citizen/dashboard        Home dashboard
  /citizen/request/new      Multi-step request form (with draft save)
  /citizen/requests         My requests list (filterable)
  /citizen/requests/:id     Request detail + live timeline + map
  /citizen/campaigns        Browse campaigns near me (list + map toggle)
  /citizen/campaigns/:id    Campaign detail + join button
  /citizen/notifications    Notifications centre (with mark all read)
  /citizen/profile          Profile + settings + language + delete account
  /citizen/feedback/:reqId  Post-completion rating + review form

VOLUNTEER  /volunteer/*
  /volunteer/onboarding     Skill + availability setup (first time)
  /volunteer/dashboard      Dashboard (task summary, impact stats)
  /volunteer/tasks          My tasks (AI-ranked, filterable)
  /volunteer/tasks/:id      Task detail + check-in/out + status update
  /volunteer/map            Map view of tasks nearby
  /volunteer/impact         Personal impact page (stats + charts)
  /volunteer/certificate    Download/share certificates
  /volunteer/leaderboard    Community volunteer leaderboard
  /volunteer/notifications  Notifications centre
  /volunteer/profile        Profile + skills + availability calendar

NGO  /ngo/*
  /ngo/dashboard            NGO overview dashboard
  /ngo/requests             Incoming requests (AI triage view)
  /ngo/requests/:id         Request detail + assign volunteer
  /ngo/volunteers           Volunteer roster + verify/manage
  /ngo/campaigns            My campaigns list
  /ngo/campaigns/new        Create campaign (AI-assisted)
  /ngo/campaigns/:id        Campaign detail + participants + attendance
  /ngo/campaigns/:id/edit   Edit campaign
  /ngo/analytics            NGO-scoped analytics + export
  /ngo/profile              NGO public profile editor
  /ngo/notifications        Notifications centre

SUPER ADMIN  /admin/*
  /admin/dashboard          Platform-wide overview + AI digest
  /admin/users              User management table (filterable, bulk actions)
  /admin/users/:uid         User detail + edit role + ban
  /admin/ngos               NGO list + approval queue
  /admin/ngos/:id           NGO detail + approve/reject
  /admin/requests           All requests (filterable + map view)
  /admin/campaigns          All campaigns
  /admin/analytics          Full analytics + export all
  /admin/audit              Audit log viewer
  /admin/reports            Reported content queue
  /admin/settings           Platform configuration
  /admin/notifications      Broadcast message to all users
```

---

## SECTION 7 — COMPLETE FRONTEND FEATURES

### 7.1 Authentication & Onboarding Flows

**Registration Flow:**
1. Enter name, email, password → select role (Citizen / Volunteer / NGO Admin)
2. Firebase creates account → send verification email
3. Redirect to `/register/verify-email` screen ("Check your inbox")
4. User clicks email link → verified → redirect to role-specific onboarding

**Citizen Onboarding (3 steps):**
- Step 1: "Welcome! Here's how to request help" (animated explainer)
- Step 2: Set your location (map picker)
- Step 3: Enable notifications (FCM permission prompt)

**Volunteer Onboarding (4 steps):**
- Step 1: Add skills (chip selector with AI suggestion from bio)
- Step 2: Set weekly availability (calendar-style grid)
- Step 3: Set service radius (slider, shows coverage on map)
- Step 4: Enable notifications + complete profile

**NGO Onboarding:**
- Fill NGO profile (name, description, coverage areas, contact)
- Submit for approval → show "Pending Super Admin approval" state
- Super Admin approves → NGO gets notification → access unlocked

**Forgot Password:**
- Enter email → Firebase sends reset link → redirect to login with success toast

### 7.2 Multi-Step Request Submission Form

Step 1 — Describe your need:
- Large text area (description)
- AI runs in background after 20 chars typed (debounced 800ms):
  - Category auto-filled with "AI suggested ✨" badge
  - Sub-tags auto-filled
  - Title auto-suggested
  - Urgency bar shown (green→red)
  - If urgency=5: red toast "⚠️ This will be escalated immediately"
- If blood_donation category → show blood type field (A+/A-/B+/B-/O+/O-/AB+/AB-)

Step 2 — Your location:
- Map picker (drag pin)
- OR type rough address → AI formats it
- Shows nearby NGOs + estimated response time

Step 3 — Add photos (optional):
- Up to 3 photos
- Client-side compression before upload (browser-image-compression)
- Preview thumbnails with remove button
- Max 5MB each after compression

Step 4 — Review + submit:
- Summary card of all entered info
- Duplicate guard: if citizen has a very similar open request → warn "You already have a similar request open. Submit anyway?"
- Rate limit check: max 5 requests per hour per citizen (show cooldown timer if exceeded)
- Submit → saved to Firestore → Cloud Function triggers AI matching

**Draft Auto-Save:**
- Form state saved to `/drafts/{uid}_request` in Firestore every 30 seconds
- If user navigates away mid-form: "You have a saved draft. Continue?" prompt on next visit
- Draft deleted on successful submission

### 7.3 Real-Time Request Status Tracker

Status pipeline: `submitted → accepted → in_progress → completed`

UI elements:
- Animated step progress bar (4 nodes with connecting lines)
- Each completed step shows checkmark + timestamp
- Current step pulses with animation
- Full timeline list below (every status change, who did it, when)
- "Volunteer on the way" card when accepted (shows volunteer name + avatar)
- Map showing volunteer's last known location vs. request location (if check-in used)
- Cancel button visible only when status = submitted or accepted
- Cancel requires a reason (dropdown: "No longer needed / Resolved another way / Other")

### 7.4 Volunteer Task Board

**List View (default):**
- AI-ranked order with reason chips ("5 min away + skill match")
- Status filter tabs: All | Pending | In Progress | Completed
- Sort: By urgency / By distance / By date
- Each card shows: category icon, urgency badge, distance, citizen first name, time since submitted

**Map View toggle:**
- Google Maps with task pins colour-coded by urgency
- Tap pin → bottom sheet with task summary + Accept button

**Task Detail Page:**
- Full request description + photos
- Citizen's first name + district (not full address for privacy)
- Check-in button → opens camera or GPS confirmation
  - Fires Firestore write to `/volunteerCheckins`
  - Citizen notified "Your volunteer has arrived"
- Status update buttons (large tap targets — mobile friendly)
- Notes field (add completion notes)
- Photo proof upload (optional, on completion)
- Check-out → request moves to completed
- AI nudge card appears if no update in 4h ("Want to send a quick update? → tap to send")

### 7.5 Volunteer Impact & Certificates

**Impact Dashboard:**
- Total tasks completed (counter animation on mount)
- Total hours contributed
- People helped estimate
- Categories breakdown (donut chart)
- Monthly trend (line chart)
- Badges earned (milestone-based: First Task, 10 Tasks, 100 Hours, etc.)

**Certificates:**
- Auto-generated PDF when volunteer hits milestones (10, 25, 50 tasks)
- Cloud Function generates PDF using puppeteer/jsPDF
- Saved to Firebase Storage → download link in notification
- Share button uses Web Share API → WhatsApp / social media

**Leaderboard:**
- Top 10 volunteers this month (score = tasks × urgency weight)
- User's own rank shown even if not in top 10
- Anonymous option (user can hide from leaderboard in settings)

### 7.6 NGO Campaign Management

**Create Campaign (AI-Assisted):**
1. Enter campaign goal (2 sentences) + target audience
2. Click "Generate with AI ✨"
3. Loading: "Crafting your campaign..."
4. Gemini fills all fields: title, description, tags, volunteer roles, date, CTA
5. NGO reviews, edits any field, adds location pin
6. Set max volunteers count per role
7. Save as Draft or Publish immediately

**Campaign Detail (NGO view):**
- Participant list (citizens who joined)
- Volunteer attendance tracker (check-in/out log)
- Real-time volunteer count vs. needed
- Generate recruitment message button → 2 style variants (formal/casual) with copy
- Edit / Archive / Cancel campaign actions

**Request Triage View:**
- AI-sorted pending requests with priority badges
- Each row: summary, AI recommended action pre-filled as button
- "Accept All AI Recommendations" one-click apply button
- Override any item before accepting
- Assign volunteer: searchable dropdown of available volunteers

### 7.7 Admin Dashboards

**Super Admin — Overview:**
- KPI row: Total requests / Active today / Resolved this week / Active volunteers
- Platform health gauge (% capacity used)
- AI Weekly Digest card (narrative text, refreshed Monday)
- Anomaly alert cards (red = critical, orange = warning)
- Request map (Google Maps with district-level heatmap)
- Top categories this week (bar chart)
- NGO activity table (ranked by requests handled)
- Recent audit log entries

**Super Admin — User Management:**
- Filterable table: search by name/email, filter by role, status
- Columns: Name, Role, Joined, Last Active, Status, Actions
- Actions: View Profile / Edit Role / Deactivate / Ban
- Bulk actions checkbox: select multiple → bulk deactivate / bulk role-change
- Add new admin manually (invite by email)

**Super Admin — NGO Approvals:**
- Pending queue (badge count on nav)
- NGO registration detail: name, description, contact, coverage area
- Approve / Reject with optional note to NGO

**Super Admin — Audit Log:**
- Full chronological log: actor, action, target, timestamp
- Filterable by actor, action type, date range
- Export as CSV

### 7.8 Shared UI Patterns (All Roles)

**Layout:**
- Desktop (≥1024px): Fixed sidebar + top header with search + notification bell + avatar menu
- Tablet (768–1023px): Collapsible sidebar (hamburger toggle)
- Mobile (≤767px): Bottom navigation bar (5 tabs max per role) + top header (search + bell)

**Global Search Bar:**
- Natural language input (AI-powered for queries >3 words)
- Keyboard shortcut: Cmd/Ctrl+K
- Recent searches saved locally
- Results grouped by type (Requests / Volunteers / Campaigns)

**Notifications Centre:**
- Bell icon with unread count badge
- Dropdown panel (desktop) / full page (mobile)
- Mark single as read (click) / Mark all as read button
- Each notification is a deep link → tapping opens exact related page
- Notification types have distinct icons + colour coding

**Confirmation Dialogs:**
- Any destructive action (delete, ban, cancel, deactivate) shows a modal: "Are you sure? This cannot be undone." with confirm/cancel
- Critical actions require typing the word "CONFIRM" in a field

**Filter + Sort Panels:**
- All list views have a filter panel (slide-in on mobile, sidebar on desktop)
- Filters: category, status, urgency, date range, district
- Sort: newest / oldest / urgency high→low / distance (volunteers)
- Active filters shown as removable chips above the list

**Skeleton Loaders:**
- Every async page/section shows matching skeleton shapes (not generic spinners)
- Skeleton matches the approximate layout of the loaded content

**Toast System (shadcn Sonner):**
- Success / Error / Info / Warning variants
- Position: bottom-right desktop, bottom-center mobile
- Auto-dismiss 4 seconds (errors stay until dismissed)
- Every Firestore mutation has a success/error toast

**Form Validation (React Hook Form + Zod):**
- Inline error messages below each field (not just on submit)
- Real-time validation as user types (on blur)
- Required fields marked with red asterisk
- Character counter on description fields

**Empty States:**
- Every list has a well-designed empty state with illustration + CTA
- "You have no active requests. Need help? Submit one now →"

**Error Boundary:**
- React Error Boundary wraps all role sections
- Shows friendly error card with "Try again" button (does window.location.reload)

**404 Page:**
- Fun illustrated 404 with "Go to Dashboard" button

**Session Timeout:**
- Firebase Auth token expires in 1 hour
- 5 minutes before expiry: toast "Your session expires soon. Stay logged in?"
- On expiry: redirect to /login with "Session expired" message

**Dark Mode:**
- Toggle in profile settings + header
- Persisted in localStorage + applied as `data-theme` attribute
- Tailwind dark: classes used throughout

**Language Switcher (i18n):**
- English / Nepali toggle in header + profile settings
- All UI labels, button text, error messages, toasts translated
- Gemini chatbot detects language and responds accordingly
- Persisted in Firestore `/users/{uid}.language`

**Accessibility:**
- All interactive elements have ARIA labels
- Focus ring visible on keyboard navigation
- Screen reader friendly (roles, labels, live regions for status updates)
- Minimum tap target 44x44px on mobile
- Colour is never the only indicator (always icon or text alongside)

**PWA Install Prompt:**
- Shows after 2nd visit (tracked in localStorage)
- Custom install banner (not browser default) with LocalAid branding
- "Install for offline access" messaging
- Dismissed prompt remembered for 30 days

**Share Button on Campaigns:**
- Uses Web Share API (native share sheet on mobile)
- Falls back to copy-link on desktop
- Share text: "Join me at [Campaign Name] by [NGO] on [Date] — [URL]"

**Image Lightbox:**
- Clicking any request/campaign photo opens full-screen lightbox
- Swipe to navigate multiple photos
- Pinch-to-zoom on mobile

---

## SECTION 8 — COMPLETE BACKEND SPECIFICATIONS

### 8.1 Firebase Cloud Functions (All)

#### `onNewRequest` — Triggered Function
```
Trigger: onDocumentCreated('/requests/{requestId}')
Actions:
  1. Run AI volunteer matching (Gemini)
  2. Save ranked matches to request.matchedVolunteerIds
  3. Send FCM push to top 3 matched volunteers
  4. Send FCM push to assigned NGO admin
  5. If aiEscalated=true → send FCM to all Super Admins + create anomaly alert
  6. Write to auditLogs: { action: 'REQUEST_CREATED', ... }
  7. Set expiry: if unaccepted after 24h → trigger reassignment
```

#### `onRequestStatusChange` — Triggered Function
```
Trigger: onDocumentUpdated('/requests/{requestId}') where status changed
Actions:
  1. Notify citizen via FCM (status update)
  2. If status=completed:
     - Update volunteer stats (completedCount++, totalHours += elapsed)
     - Check volunteer badge milestones → award badge + generate certificate if milestone hit
     - Update NGO stats (totalRequestsHandled++)
     - Update analytics counters
     - Create feedback request notification to citizen (prompt to rate)
  3. Write status change to request.timeline array
  4. Write to auditLogs
```

#### `onVolunteerCheckin` — Triggered Function
```
Trigger: onDocumentCreated('/volunteerCheckins/{checkinId}')
Actions:
  1. Notify citizen: "Your volunteer [Name] has arrived"
  2. Update request status to 'in_progress' if checkin type
  3. Log in request.timeline
```

#### `onNewFeedback` — Triggered Function
```
Trigger: onDocumentCreated('/feedback/{feedbackId}')
Actions:
  1. Update volunteer.rating (recalculate average)
  2. Run Gemini sentiment analysis on review text
  3. Save aiSentiment + aiSentimentScore to feedback doc
  4. Notify volunteer: "You received a [N]-star review"
```

#### `onNGOApproved` — Triggered Function
```
Trigger: onDocumentUpdated('/ngos/{ngoId}') where approvalStatus changed to 'approved'
Actions:
  1. Send FCM + email to NGO admin: "Your NGO has been approved"
  2. Set NGO isActive=true
  3. Write to auditLogs
```

#### `weeklyDigest` — Scheduled Function
```
Schedule: every Monday 08:00 Asia/Kathmandu
Actions:
  1. Aggregate last 7 days of Firestore data
  2. Send to Gemini 1.5-pro for narrative generation
  3. Save to /analytics/weekly_{YYYY-WW}
  4. Send push notification to all Super Admins: "Weekly digest is ready"
  5. Email digest to all Super Admin emails
```

#### `dailyNGOSummary` — Scheduled Function
```
Schedule: every day 08:00 Asia/Kathmandu
Actions:
  For each active NGO:
    1. Count yesterday's new requests, completions, volunteer activity
    2. Email summary to NGO admin (if they have dailySummary pref enabled)
```

#### `hourlyAnomalyDetector` — Scheduled Function
```
Schedule: every 1 hour
Actions:
  1. Fetch metrics: requests per area (last hour), volunteer capacity, NGO activity
  2. Compare to 7-day rolling baseline
  3. Send to Gemini for anomaly analysis
  4. If anomalies found:
     - Save to Firestore /analytics/anomalies
     - Push notification to Super Admins for 'high' or 'critical' severity
```

#### `expireUnacceptedRequests` — Scheduled Function
```
Schedule: every 30 minutes
Actions:
  Find requests where:
    - status = 'submitted'
    - createdAt < now - 24 hours
  For each:
    1. Re-run AI volunteer matching with updated volunteer pool
    2. Notify next volunteer in matchedVolunteerIds queue
    3. Log in request.timeline: "Auto-reassigned after 24h timeout"
    4. Notify citizen: "We're finding a new volunteer for you"
```

#### `generateCertificate` — Triggered Function
```
Trigger: onDocumentUpdated('/volunteers/{uid}') where badge milestone hit
Actions:
  1. Generate PDF certificate (jsPDF in function)
  2. Upload to Firebase Storage: /certificates/{uid}/{badgeName}.pdf
  3. Update volunteer doc with certificate URL
  4. Create notification: "Your certificate is ready to download"
```

#### `cleanupDrafts` — Scheduled Function
```
Schedule: every day 03:00
Actions:
  Delete /drafts docs older than 7 days
```

#### `welcomeEmail` — Triggered Function
```
Trigger: onCreate on Firebase Auth user
Actions:
  1. Send welcome email with verify link
  2. Create /users/{uid} doc with defaults
  3. Log to auditLogs
```

### 8.2 Firestore Composite Indexes Required
```
requests: status ASC + createdAt DESC
requests: citizenId ASC + status ASC + createdAt DESC
requests: assignedVolunteerId ASC + status ASC
requests: category ASC + urgency DESC + createdAt DESC
requests: location.district ASC + status ASC + urgency DESC
volunteers: skills ARRAY_CONTAINS + isActive ASC + rating DESC
campaigns: ngoId ASC + status ASC + eventDate ASC
campaigns: status ASC + eventDate ASC
feedback: volunteerId ASC + createdAt DESC
notifications: userId ASC + read ASC + createdAt DESC
auditLogs: actorId ASC + timestamp DESC
```

### 8.3 Firebase Storage Structure
```
/avatars/{uid}/profile.jpg           (max 2MB)
/requests/{requestId}/photo_1.jpg    (max 5MB, up to 3)
/requests/{requestId}/proof.jpg      (completion proof by volunteer)
/ngos/{ngoId}/logo.jpg               (max 2MB)
/campaigns/{campaignId}/cover.jpg    (max 5MB)
/certificates/{uid}/{badgeName}.pdf  (auto-generated)
```

### 8.4 Complete Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAuth() { return request.auth != null; }
    function isOwner(uid) { return request.auth.uid == uid; }
    function getRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }
    function isRole(role) { return isAuth() && getRole() == role; }
    function isSuperAdmin() { return isRole('superadmin'); }
    function isNGO() { return isRole('ngo') || isSuperAdmin(); }
    function isVolunteer() { return isRole('volunteer') || isNGO(); }
    function isActiveBanned() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isBanned == true;
    }
    function notBanned() { return isAuth() && !isActiveBanned(); }

    // Users
    match /users/{uid} {
      allow read: if isAuth();
      allow create: if isOwner(uid) && notBanned();
      allow update: if (isOwner(uid) || isSuperAdmin()) && notBanned();
      allow delete: if isSuperAdmin();
    }

    match /citizens/{uid} {
      allow read: if isAuth();
      allow write: if isOwner(uid) || isSuperAdmin();
    }

    match /volunteers/{uid} {
      allow read: if isAuth();
      allow write: if isOwner(uid) || isNGO();
    }

    // Requests
    match /requests/{requestId} {
      allow read: if isAuth();
      allow create: if notBanned()
                    && request.resource.data.citizenId == request.auth.uid;
      allow update: if isAuth() && notBanned() && (
        resource.data.citizenId == request.auth.uid ||
        resource.data.assignedVolunteerId == request.auth.uid ||
        isNGO()
      );
      allow delete: if isSuperAdmin();
    }

    // NGOs
    match /ngos/{ngoId} {
      allow read: if isAuth();
      allow create: if isRole('ngo') && notBanned();
      allow update: if (resource.data.adminId == request.auth.uid || isSuperAdmin());
      allow delete: if isSuperAdmin();
    }

    // Campaigns
    match /campaigns/{campaignId} {
      allow read: if isAuth();
      allow create: if isNGO() && notBanned();
      allow update: if isNGO();
      allow delete: if isSuperAdmin();
    }

    // Feedback
    match /feedback/{feedbackId} {
      allow read: if isAuth();
      allow create: if notBanned()
                    && request.resource.data.citizenId == request.auth.uid;
      allow update: if false; // immutable once submitted
      allow delete: if isSuperAdmin();
    }

    // Notifications
    match /notifications/{notifId} {
      allow read: if isOwner(resource.data.userId);
      allow update: if isOwner(resource.data.userId); // mark as read only
      allow create, delete: if false; // only Cloud Functions write these
    }

    // Volunteer Checkins
    match /volunteerCheckins/{checkinId} {
      allow read: if isAuth();
      allow create: if isRole('volunteer')
                    && request.resource.data.volunteerId == request.auth.uid;
      allow update, delete: if false;
    }

    // Audit Logs — read by superadmin only, written by Cloud Functions
    match /auditLogs/{logId} {
      allow read: if isSuperAdmin();
      allow write: if false; // Cloud Functions only
    }

    // Reported Content
    match /reportedContent/{reportId} {
      allow read: if isSuperAdmin() || isNGO();
      allow create: if notBanned();
      allow update: if isSuperAdmin();
      allow delete: if isSuperAdmin();
    }

    // Drafts
    match /drafts/{draftId} {
      allow read, write: if isAuth()
                         && draftId.matches(request.auth.uid + '_.*');
    }

    // Analytics — read by NGO (own) + superadmin (all)
    match /analytics/{period} {
      allow read: if isSuperAdmin() || isNGO();
      allow write: if false; // Cloud Functions only
    }
  }
}
```

### 8.5 Firebase Storage Security Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    function isAuth() { return request.auth != null; }
    function isImage() {
      return request.resource.contentType.matches('image/.*');
    }
    function isPDF() {
      return request.resource.contentType == 'application/pdf';
    }
    function maxSize(mb) {
      return request.resource.size < mb * 1024 * 1024;
    }

    // Avatars
    match /avatars/{uid}/{file} {
      allow read: if isAuth();
      allow write: if isAuth() && request.auth.uid == uid
                   && isImage() && maxSize(2);
    }

    // Request photos
    match /requests/{requestId}/{file} {
      allow read: if isAuth();
      allow write: if isAuth() && isImage() && maxSize(5);
    }

    // NGO logos
    match /ngos/{ngoId}/{file} {
      allow read: if true; // public
      allow write: if isAuth() && isImage() && maxSize(2);
    }

    // Campaign covers
    match /campaigns/{campaignId}/{file} {
      allow read: if true; // public
      allow write: if isAuth() && isImage() && maxSize(5);
    }

    // Certificates — read by owner only, written by Cloud Functions
    match /certificates/{uid}/{file} {
      allow read: if isAuth() && request.auth.uid == uid;
      allow write: if false; // Cloud Functions only
    }
  }
}
```

### 8.6 Input Sanitisation
```javascript
// src/lib/sanitise.js
// Run this on ALL user text before writing to Firestore
import DOMPurify from 'dompurify';

export function sanitise(text) {
  if (typeof text !== 'string') return text;
  return DOMPurify.sanitize(text.trim(), { ALLOWED_TAGS: [] }); // strips all HTML
}

// Usage in every form submit:
const safeDescription = sanitise(formData.description);
const safeTitle = sanitise(formData.title);
```

---

## SECTION 9 — ALL 15 AI FEATURES (COMPLETE SPECS)

### AI Architecture Rule
- Use `gemini-1.5-flash` for: request form analysis, chatbot, volunteer matching, search, triage, auto-status, skill recommender, recruitment messages, campaign generator
- Use `gemini-1.5-pro` for: weekly digest, sentiment analysis, anomaly detection
- Batch related calls into one API request wherever possible
- Every AI feature has a graceful manual fallback — AI never blocks the user

### Gemini Helper Module: `src/lib/gemini.js`
```javascript
const FLASH = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`;
const PRO   = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`;

export async function askGemini(prompt, systemInstruction = '', usePro = false) {
  const endpoint = usePro ? PRO : FLASH;
  try {
    const res = await Promise.race([
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemInstruction }] },
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 1000 }
        })
      }),
      new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 9000))
    ]);
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
  } catch (err) {
    console.warn('Gemini error:', err.message);
    return null; // caller handles null = use fallback
  }
}

export function parseJSON(text) {
  if (!text) return null;
  try {
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch {
    return null;
  }
}
```

### Feature 1+2+3 — BATCHED: Request Analyser (runs on request form)
```javascript
// Trigger: debounced 800ms after 20+ chars typed in description
export const analyseRequest = debounce(async (description, locationHint) => {
  const raw = await askGemini(`
Analyse this support request for LocalAid Nepal. Return ONLY valid JSON, no markdown.
Description: "${description}"
Location hint: "${locationHint || 'not provided'}"

{
  "category": "elderly_care|emergency|blood_donation|welfare|food|medical|shelter|education|other",
  "subTags": ["max 3 tags"],
  "suggestedTitle": "short title under 10 words",
  "urgency": 1,
  "urgencyLabel": "Low|Moderate|Medium|High|Critical",
  "escalate": false,
  "criticalKeywords": [],
  "formattedAddress": "structured address or null",
  "district": "district name or null",
  "confidence": 0.85
}`,
  'You are a social support triage assistant in Nepal. Return ONLY valid JSON.');
  return parseJSON(raw) ?? { category: null, urgency: 3, escalate: false };
}, 800);
```

### Feature 4 — Citizen Chatbot
```javascript
// System prompt (pass on every call with fresh user context)
function buildChatbotSystem(user, openRequests) {
  return `You are LocalAid Assistant for a social support platform in Nepal.
Help citizens: submit requests, check status, find campaigns, handle emergencies.

User: ${user.name}, Location: ${user.location?.address || 'unknown'}
Open requests: ${JSON.stringify(openRequests.map(r => ({id: r.id, type: r.category, status: r.status, volunteer: r.assignedVolunteerName})))}

Rules:
- Simple language (many users are elderly or non-technical)
- Detect Nepali text → respond in Nepali
- Never invent data — only use context above
- ALWAYS for emergencies: "Call 100 (Police) or 102 (Ambulance) immediately"
- Responses under 3 sentences unless explaining steps
- Format actions as: [ACTION:submit_request], [ACTION:check_status:{id}] etc.`;
}
```

### Feature 5 — Volunteer Matcher (Cloud Function)
```javascript
// Runs in Cloud Function after new request created
async function matchVolunteers(request, volunteers) {
  const raw = await askGemini(`
Match volunteers to this request. Return JSON array sorted by score.
Request: ${JSON.stringify({type: request.category, description: request.description, urgency: request.urgency, district: request.location.district})}
Volunteers: ${JSON.stringify(volunteers.map(v => ({id: v.id, skills: v.skills, distanceKm: v.distance, activeLoad: v.activeTaskCount, rating: v.rating})))}
[{"volunteerId":"id","score":0-100,"matchReasons":["reason"],"estimatedResponseHours":2}]`,
  'Volunteer matching engine. Return ONLY valid JSON array.');
  return parseJSON(raw) ?? [];
}
```

### Feature 6 — Task Priority Ranker
```javascript
async function rankTasks(volunteer, tasks) {
  const raw = await askGemini(`
Rank these tasks for volunteer at ${volunteer.location.address}.
Tasks: ${JSON.stringify(tasks.map(t => ({id: t.id, urgency: t.urgency, district: t.location.district, hoursWaiting: t.hoursWaiting, category: t.category})))}
Return: [{"taskId":"id","recommendedOrder":1,"reason":"brief one-line reason"}]`,
  'Task scheduler. Return ONLY valid JSON.');
  return parseJSON(raw) ?? [];
}
```

### Feature 7 — Volunteer Skill Recommender
```javascript
async function suggestSkills(bio) {
  const skills = ['elderly_care','medical_first_aid','transportation','cooking',
    'teaching','counselling','construction','technology','translation',
    'childcare','disaster_relief','blood_donation_coordination'];
  const raw = await askGemini(`
Bio: "${bio}"
Available skills: ${JSON.stringify(skills)}
Return: {"suggestedSkills":["skill1","skill2"]}`);
  return parseJSON(raw)?.suggestedSkills ?? [];
}
```

### Feature 8 — Campaign Content Generator
```javascript
async function generateCampaign(goal, audience, ngoName) {
  const raw = await askGemini(`
Generate a LocalAid campaign for Nepal NGO "${ngoName}".
Goal: "${goal}" | Audience: "${audience}"
Return JSON:
{
  "title": "catchy title",
  "description": "2 paragraphs, motivating tone",
  "tags": ["tag1","tag2","tag3"],
  "volunteerRoles": [{"role":"name","skills":[],"count":5}],
  "suggestedDate": "YYYY-MM-DD",
  "estimatedImpact": "X people",
  "callToAction": "Join Now"
}`);
  return parseJSON(raw);
}
```

### Feature 9 — Volunteer Recruitment Messages
```javascript
async function generateRecruitmentMessages(campaign) {
  const raw = await askGemini(`
Write volunteer recruitment messages for WhatsApp.
Campaign: "${campaign.title}" | Date: ${campaign.eventDate} | NGO: ${campaign.ngoName}
Needs: ${campaign.volunteerRoles.map(r=>r.role).join(', ')} | Location: ${campaign.location.address}
Generate TWO versions (formal + casual), each under 100 words, ending with [LINK].
Return: {"formal":"...","casual":"..."}`);
  return parseJSON(raw);
}
```

### Feature 10 — Request Triage Assistant
```javascript
async function triageRequests(requests, volunteers, capacity) {
  const raw = await askGemini(`
Triage these pending requests for NGO coordinator.
Requests: ${JSON.stringify(requests.slice(0,20))}
Volunteers available: ${volunteers.length} | Capacity today: ${capacity}
Return: [{"requestId":"id","priority":1-5,"action":"assign_volunteer|escalate|contact_citizen|defer","suggestedVolunteerId":"id or null","reason":"one sentence"}]`,
  'Social support triage coordinator. Return ONLY valid JSON.');
  return parseJSON(raw) ?? [];
}
```

### Feature 11 — Weekly Impact Digest (Cloud Function, uses Pro)
```javascript
async function generateWeeklyDigest(stats) {
  return await askGemini(`
Write LocalAid weekly impact report for Nepal government officials.
Stats: ${JSON.stringify(stats)}
Sections: 1) Executive Summary (2 sentences) 2) Key Achievements (3 bullets)
3) Areas Needing Attention (2 bullets + specific recommendations)
4) Community Highlight (inferred from data patterns)
5) Next Week Prediction (1 sentence)
Tone: professional yet warm.`,
  'Report writer for government. Plain text sections, no markdown headers.',
  true /* usePro */);
}
```

### Feature 12 — Anomaly Detector (Cloud Function, hourly)
```javascript
async function detectAnomalies(current, baseline) {
  const raw = await askGemini(`
Detect platform anomalies. Compare current vs baseline.
Current: ${JSON.stringify(current)} | Baseline: ${JSON.stringify(baseline)}
Return anomalies with confidence > 0.7:
[{"type":"spike|capacity|inactivity|repeat|cancellation","severity":"low|medium|high|critical","description":"plain English","action":"specific recommendation","area":"location or entity"}]
Empty array if all normal.`,
  'Platform monitoring system. Return ONLY valid JSON.', true);
  return parseJSON(raw) ?? [];
}
```

### Feature 13 — Natural Language Search
```javascript
async function nlSearch(query, schema) {
  if (query.trim().split(' ').length <= 3) return null; // short = direct Firestore
  const raw = await askGemini(`
Convert to Firestore query for LocalAid Nepal.
Query: "${query}"
Collections: requests, volunteers, campaigns
Schema: ${JSON.stringify(schema)}
Return: {"collection":"name","filters":[{"field":"x","operator":"==|>=|array-contains","value":"y"}],"orderBy":{"field":"x","direction":"asc|desc"},"limit":20}`);
  return parseJSON(raw);
}
```

### Feature 14 — Auto Status Nudge
```javascript
async function suggestStatusUpdate(task, hoursElapsed) {
  const raw = await askGemini(`
Volunteer has task: ${task.category} for ${hoursElapsed}h with no update.
Return: {"suggestedStatus":"in_progress|completed|needs_help","draftMessage":"pre-written update under 20 words","shouldEscalate":false}`);
  return parseJSON(raw);
}
```

### Feature 15 — Sentiment Analyser (Cloud Function, daily)
```javascript
async function analyseSentiment(feedbackArray) {
  const raw = await askGemini(`
Analyse citizen feedback for LocalAid.
Feedback: ${JSON.stringify(feedbackArray)}
Return: {"overallSentiment":"positive|mixed|negative","sentimentScore":0-10,"topPraise":["aspect"],"topComplaints":["complaint"],"urgentIssues":[],"sampleQuotes":{"positive":"...","negative":"..."},"recommendedActions":["action"]}`,
  'Feedback analyst. Return ONLY valid JSON.', true);
  return parseJSON(raw);
}
```

---

## SECTION 10 — COMPLETE FOLDER STRUCTURE

```
localaid/
├── public/
│   ├── icons/
│   │   ├── icon-192.png
│   │   ├── icon-512.png
│   │   └── icon-maskable.png
│   ├── manifest.json
│   └── offline.html
├── src/
│   ├── lib/
│   │   ├── firebase.js          Firebase init (auth, db, storage, messaging)
│   │   ├── gemini.js            Gemini helper (askGemini, parseJSON)
│   │   ├── sanitise.js          DOMPurify input sanitiser
│   │   ├── storage.js           Firebase Storage helpers
│   │   ├── analytics.js         Analytics aggregation helpers
│   │   └── utils.js             Date formatting, distance calc, etc.
│   ├── i18n/
│   │   ├── index.js             i18next config
│   │   ├── en.json              English strings
│   │   └── ne.json              Nepali strings
│   ├── stores/
│   │   ├── authStore.js         Zustand: user, role, isLoading
│   │   ├── uiStore.js           Zustand: theme, language, sidebarOpen
│   │   └── notificationStore.js Zustand: unreadCount
│   ├── hooks/
│   │   ├── useAuth.js           Firebase auth listener
│   │   ├── useRequests.js       React Query + Firestore requests
│   │   ├── useVolunteers.js     React Query + Firestore volunteers
│   │   ├── useCampaigns.js      React Query + Firestore campaigns
│   │   ├── useNotifications.js  onSnapshot for user notifications
│   │   ├── useRequestAI.js      Batched Gemini call for request form
│   │   ├── useDraft.js          Auto-save draft to Firestore
│   │   └── usePWA.js            Install prompt + service worker state
│   ├── components/
│   │   ├── ui/                  shadcn components (Button, Input, etc.)
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx      Desktop sidebar (role-aware)
│   │   │   ├── BottomNav.jsx    Mobile bottom navigation
│   │   │   ├── Header.jsx       Top header (search, bell, avatar)
│   │   │   ├── GlobalSearch.jsx NL search bar with AI
│   │   │   └── ErrorBoundary.jsx
│   │   ├── auth/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── RoleGuard.jsx
│   │   │   └── EmailVerifyGuard.jsx
│   │   ├── onboarding/
│   │   │   ├── CitizenOnboarding.jsx
│   │   │   ├── VolunteerOnboarding.jsx
│   │   │   └── NGOPendingScreen.jsx
│   │   ├── requests/
│   │   │   ├── RequestForm/
│   │   │   │   ├── index.jsx    Multi-step wrapper
│   │   │   │   ├── Step1.jsx    Description + AI analysis
│   │   │   │   ├── Step2.jsx    Location picker
│   │   │   │   ├── Step3.jsx    Photos
│   │   │   │   └── Step4.jsx    Review + submit
│   │   │   ├── RequestCard.jsx  List item card
│   │   │   ├── RequestDetail.jsx Full detail + timeline
│   │   │   ├── StatusTracker.jsx Animated step progress bar
│   │   │   ├── UrgencyBar.jsx   Colour gradient urgency indicator
│   │   │   └── FilterPanel.jsx  Filter + sort slide-in panel
│   │   ├── volunteers/
│   │   │   ├── TaskBoard.jsx    AI-ranked task list
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskDetail.jsx   Check-in/out + status update
│   │   │   ├── SkillPicker.jsx  Chip selector with AI suggest
│   │   │   ├── AvailabilityGrid.jsx Weekly schedule grid
│   │   │   ├── ImpactDashboard.jsx
│   │   │   ├── Leaderboard.jsx
│   │   │   └── CertificateCard.jsx
│   │   ├── ngos/
│   │   │   ├── CampaignCard.jsx
│   │   │   ├── CampaignForm/
│   │   │   │   ├── index.jsx
│   │   │   │   └── AIGeneratePanel.jsx
│   │   │   ├── TriageView.jsx   AI-prioritised request queue
│   │   │   ├── VolunteerRoster.jsx
│   │   │   └── AttendanceTracker.jsx
│   │   ├── admin/
│   │   │   ├── KPIRow.jsx       Top stats row
│   │   │   ├── AnalyticsCharts.jsx (Recharts)
│   │   │   ├── UserTable.jsx    Filterable + bulk actions
│   │   │   ├── NGOApprovalQueue.jsx
│   │   │   ├── AuditLog.jsx
│   │   │   ├── AnomalyAlerts.jsx
│   │   │   └── WeeklyDigestCard.jsx
│   │   ├── ai/
│   │   │   ├── Chatbot/
│   │   │   │   ├── index.jsx    Floating button + panel
│   │   │   │   ├── ChatMessage.jsx
│   │   │   │   ├── QuickChips.jsx
│   │   │   │   └── TypingIndicator.jsx
│   │   │   └── AIBadge.jsx      "AI suggested ✨" badge
│   │   ├── common/
│   │   │   ├── SkeletonCard.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── ConfirmDialog.jsx
│   │   │   ├── ImageLightbox.jsx
│   │   │   ├── MapView.jsx      Google Maps wrapper
│   │   │   ├── ShareButton.jsx  Web Share API
│   │   │   └── PWAInstallBanner.jsx
│   │   └── feedback/
│   │       ├── RatingForm.jsx   Post-completion star rating + review
│   │       └── SentimentCard.jsx (admin view)
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── ResetPassword.jsx
│   │   ├── VerifyEmail.jsx
│   │   ├── NotFound.jsx
│   │   ├── Offline.jsx
│   │   ├── citizen/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── NewRequest.jsx
│   │   │   ├── MyRequests.jsx
│   │   │   ├── RequestDetail.jsx
│   │   │   ├── Campaigns.jsx
│   │   │   ├── CampaignDetail.jsx
│   │   │   ├── Notifications.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── FeedbackForm.jsx
│   │   ├── volunteer/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Tasks.jsx
│   │   │   ├── TaskDetail.jsx
│   │   │   ├── MapView.jsx
│   │   │   ├── Impact.jsx
│   │   │   ├── Certificates.jsx
│   │   │   ├── Leaderboard.jsx
│   │   │   ├── Notifications.jsx
│   │   │   └── Profile.jsx
│   │   ├── ngo/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Requests.jsx
│   │   │   ├── RequestDetail.jsx
│   │   │   ├── Volunteers.jsx
│   │   │   ├── Campaigns.jsx
│   │   │   ├── CampaignNew.jsx
│   │   │   ├── CampaignDetail.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Notifications.jsx
│   │   └── admin/
│   │       ├── Dashboard.jsx
│   │       ├── Users.jsx
│   │       ├── UserDetail.jsx
│   │       ├── NGOs.jsx
│   │       ├── NGODetail.jsx
│   │       ├── Requests.jsx
│   │       ├── Analytics.jsx
│   │       ├── AuditLog.jsx
│   │       ├── Reports.jsx
│   │       ├── Settings.jsx
│   │       └── Notifications.jsx
│   ├── App.jsx                  Router + lazy loading setup
│   └── main.jsx                 Entry point + PWA register
├── functions/
│   ├── src/
│   │   ├── index.js             Exports all Cloud Functions
│   │   ├── triggers/
│   │   │   ├── onNewRequest.js
│   │   │   ├── onRequestStatusChange.js
│   │   │   ├── onVolunteerCheckin.js
│   │   │   ├── onNewFeedback.js
│   │   │   ├── onNGOApproved.js
│   │   │   └── onAuthUserCreated.js
│   │   ├── scheduled/
│   │   │   ├── weeklyDigest.js
│   │   │   ├── dailyNGOSummary.js
│   │   │   ├── hourlyAnomalyDetector.js
│   │   │   ├── expireUnacceptedRequests.js
│   │   │   └── cleanupDrafts.js
│   │   └── lib/
│   │       ├── gemini.js        Server-side Gemini caller
│   │       ├── email.js         Email sender (via Nodemailer/SendGrid)
│   │       └── pdf.js           Certificate PDF generator
│   └── package.json
├── firestore.rules
├── storage.rules
├── firestore.indexes.json       Composite indexes
├── firebase.json
├── .firebaserc
├── vite.config.js
├── tailwind.config.js
├── .env.local                   Never commit
├── .env.example                 Commit this
├── vercel.json
└── .github/
    └── workflows/
        └── deploy.yml
```

---

## SECTION 11 — KEY CONFIGURATION FILES

### `vite.config.js`
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/firestore\.googleapis\.com/,
            handler: 'NetworkFirst',
            options: { cacheName: 'firestore-cache', networkTimeoutSeconds: 10 }
          }
        ]
      },
      manifest: {
        name: 'LocalAid',
        short_name: 'LocalAid',
        description: 'Connecting communities, one request at a time.',
        theme_color: '#2563EB',
        background_color: '#F8FAFC',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      }
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          charts: ['recharts'],
          maps: ['@react-google-maps/api']
        }
      }
    }
  }
});
```

### `vercel.json`
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "headers": [
    { "source": "/sw.js", "headers": [{ "key": "Cache-Control", "value": "no-cache" }] },
    { "source": "/(.*)", "headers": [
      { "key": "X-Content-Type-Options", "value": "nosniff" },
      { "key": "X-Frame-Options", "value": "DENY" },
      { "key": "X-XSS-Protection", "value": "1; mode=block" }
    ]}
  ]
}
```

### `.github/workflows/deploy.yml`
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run build
      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun --upload.target=temporary-public-storage || true
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: ${{ github.ref == 'refs/heads/main' && '--prod' || '' }}
```

---

## SECTION 12 — UI / DESIGN SYSTEM

### Colour Palette
```css
:root {
  --primary:       #2563EB;
  --primary-dark:  #1D4ED8;
  --primary-light: #DBEAFE;
  --accent:        #10B981;
  --accent-dark:   #059669;
  --warning:       #F59E0B;
  --danger:        #EF4444;
  --surface:       #F8FAFC;
  --card:          #FFFFFF;
  --border:        #E2E8F0;
  --text-primary:  #0F172A;
  --text-secondary:#475569;
  --text-muted:    #94A3B8;
}

[data-theme="dark"] {
  --surface:       #0F172A;
  --card:          #1E293B;
  --border:        #334155;
  --text-primary:  #F1F5F9;
  --text-secondary:#94A3B8;
}
```

### Typography
- Headings: **Plus Jakarta Sans** (Google Fonts)
- Body: **DM Sans**
- Mono/IDs: **JetBrains Mono**

### Urgency Colour Coding
```
1 Low      → green  (#10B981)
2 Moderate → teal   (#14B8A6)
3 Medium   → amber  (#F59E0B)
4 High     → orange (#F97316)
5 Critical → red    (#EF4444) + pulsing border animation
```

### Status Colour Coding
```
submitted   → blue   (#3B82F6)
accepted    → purple (#8B5CF6)
in_progress → amber  (#F59E0B)
completed   → green  (#10B981)
cancelled   → grey   (#94A3B8)
```

---

## SECTION 13 — PERFORMANCE REQUIREMENTS

- Lighthouse PWA score ≥ 90 (enforced in CI)
- First Contentful Paint < 2 seconds
- All routes lazy-loaded via React.lazy + Suspense
- All images lazy-loaded via IntersectionObserver
- Firestore pagination with `startAfter` cursor (20 items per page)
- React Query staleTime: 30 seconds (don't refetch every navigation)
- Client-side image compression before upload (browser-image-compression)
- Bundle chunking (vendor / firebase / charts / maps — see vite.config.js above)

---

## SECTION 14 — TESTING PLAN

| Type | Tool | Target |
|---|---|---|
| Unit | Vitest + Testing Library | All utility functions + hooks |
| Integration | Vitest + Firebase emulator | Form flows + Firestore ops |
| E2E | Playwright | Full journeys: register, submit request, assign volunteer, complete |
| Security | Firebase Rules unit tests (`@firebase/rules-unit-testing`) | All Firestore + Storage rules |
| Performance | Lighthouse CI (GitHub Actions) | PWA score ≥ 90 |
| UAT | Manual (all 4 roles) | All user stories |
| AI fallback | Manual | Turn off Gemini key → every feature still works manually |

---

## SECTION 15 — IMPLEMENTATION SPRINTS

### Sprint 1 — Foundation (Week 1–2)
- [ ] Vite + React + Tailwind + PWA setup + i18n (en/ne)
- [ ] Firebase init (Auth, Firestore, Storage, FCM)
- [ ] Registration (with role selection) + Email verification flow
- [ ] Login + Forgot password + Reset password
- [ ] Protected routes + role guard + email verify guard
- [ ] Base layout (sidebar, bottom nav, header, dark mode toggle)
- [ ] Error boundary + 404 page + offline page
- [ ] Input sanitisation module

### Sprint 2 — Citizen Request Flow (Week 3–4)
- [ ] Citizen onboarding (3-step walkthrough)
- [ ] Multi-step request form (with draft auto-save)
- [ ] Batched Gemini AI analysis (features 1+2+3) + fallback
- [ ] Photo upload with client-side compression
- [ ] Real-time status tracker with timeline log
- [ ] FCM push notifications (request_accepted, status_update)
- [ ] Cancel request with reason

### Sprint 3 — Volunteer Module (Week 5)
- [ ] Volunteer onboarding (skills + availability + radius)
- [ ] Task board (AI-ranked, filter/sort, list + map view)
- [ ] Task detail + check-in/check-out (GPS)
- [ ] Auto status nudge (Feature 14)
- [ ] Impact dashboard + leaderboard
- [ ] Certificate generation Cloud Function + download

### Sprint 4 — NGO Module (Week 6)
- [ ] NGO registration + approval pending screen
- [ ] Request triage view (AI-assisted, Feature 10)
- [ ] Campaign management (create, edit, publish)
- [ ] AI campaign generator (Feature 8) + recruitment messages (Feature 9)
- [ ] Volunteer roster + verify volunteers
- [ ] Campaign participant management

### Sprint 5 — Admin Module (Week 7)
- [ ] Super Admin dashboard (KPIs, anomaly alerts, weekly digest card)
- [ ] User management (table, bulk actions, ban/deactivate)
- [ ] NGO approval queue
- [ ] Audit log viewer
- [ ] Full analytics + export PDF/CSV
- [ ] Platform settings

### Sprint 6 — AI, Automation & Cloud Functions (Week 8)
- [ ] Gemini chatbot (Feature 4) with emergency detection
- [ ] Volunteer matcher Cloud Function (Feature 5)
- [ ] Weekly digest scheduled function (Feature 11)
- [ ] Hourly anomaly detector (Feature 12)
- [ ] Natural language search (Feature 13)
- [ ] Sentiment analyser scheduled function (Feature 15)
- [ ] Expire unaccepted requests function
- [ ] Daily NGO summary email function
- [ ] Feedback flow (post-completion rating + Gemini sentiment)

### Sprint 7 — Polish + Deploy (Week 9–10)
- [ ] Full Nepali translation (ne.json)
- [ ] ARIA accessibility pass (all interactive elements)
- [ ] Dark mode final pass
- [ ] PWA install banner + offline caching
- [ ] Lighthouse CI setup in GitHub Actions (≥90 score)
- [ ] Firebase Security Rules unit tests
- [ ] E2E tests (Playwright — 5 critical flows)
- [ ] Load test (Firebase emulator with 100 simulated users)
- [ ] Security audit (rules, sanitisation, key exposure check)
- [ ] UAT with stakeholders (all 4 roles)
- [ ] Production deploy to Vercel + Firebase

---

## SECTION 16 — CRITICAL IMPLEMENTATION NOTES

1. **API keys in `.env.local` only** — never hardcode, never commit.
2. **Gemini keys must move to Cloud Functions before production** — client-side key is acceptable in dev only.
3. **Firestore rules are the real security layer** — UI role checks are UX only, not security.
4. **Never trust the client for role** — always re-fetch `/users/{uid}.role` from Firestore server-side in Cloud Functions.
5. **Every AI call has an 8-second timeout and a manual fallback** — AI never blocks a user action.
6. **Sanitise ALL user input** with DOMPurify before any Firestore write — strip HTML/scripts.
7. **Compress images client-side** before uploading to Firebase Storage (saves quota + bandwidth).
8. **Unsubscribe all `onSnapshot` listeners** in `useEffect` cleanup or you'll have memory leaks.
9. **Vercel `rewrites`** config is required for React Router deep links — without it, direct URL = 404.
10. **Service worker must be registered after app mounts** — not in `index.html`.
11. **FCM VAPID key** is required for web push — generate in Firebase Console → Cloud Messaging.
12. **Firestore composite indexes** must be deployed before queries that use them — see Section 5.
13. **Draft saving** uses debounced Firestore write (every 30s) — not `localStorage` (too unreliable cross-tab).
14. **Blood type field** only shows on the request form when category = `blood_donation`.
15. **NGO accounts start locked** (`approvalStatus: 'pending'`) — NGO pages must check approval before allowing access.
16. **Volunteer certificate PDFs** are generated in Cloud Functions (not client-side) to ensure consistent output.
17. **Rate limiting** for request submission (max 5/hour/citizen) must be enforced in Cloud Function, not just frontend.
18. **Google Maps API** — enable both "Maps JavaScript API" AND "Places API" in Google Cloud Console.
19. **Firebase Blaze plan** (pay-as-you-go) is required to use Cloud Functions — free plan does not support them.
20. **i18n strings** — every UI text string must use `t('key')` from react-i18next, not hardcoded text.

---

*LocalAid — Final Complete Prompt v1.0*
*Combines: PPF + PSF + Investigation Report + Full Frontend Spec + Full Backend Spec + All 15 AI Features + Security + DevOps*
*By Bhusan Raj Lamichhane (NP069589) — paste this single file into your vibe-coding tool.*
