# Scripts & Migration

## Firestore Migration

**See [MIGRATION.md](./MIGRATION.md) for detailed instructions.**

### Quick Start
1. Add your Firebase service account JSON as a GitHub Secret (`FIREBASE_SERVICE_ACCOUNT_JSON`)
2. Go to GitHub Actions → "Migrate to Firestore" → "Run workflow"
3. Done! Data is automatically seeded to Firestore

### Why GitHub Actions?
Local Windows/Node 24 has OpenSSL incompatibilities with RSA key parsing. The GitHub Actions runner (Ubuntu with Node 18) has proper OpenSSL support and handles the migration reliably.

### What Gets Migrated
- `seeds/requests.json` → `requests` collection
- `seeds/campaigns.json` → `campaigns` collection
- `seeds/volunteers.json` → `volunteers` collection
- `seeds/notifications.json` → `notifications` collection
- `seeds/users.json` → `users` collection (if present)

### After Migration
The Expo app will:
1. Read live data from Firestore via `DataContext.tsx` listeners
2. Fall back to seed data if Firestore is empty
3. Support real-time updates automatically
