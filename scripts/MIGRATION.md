# Firestore Migration Guide

## Problem
Local Node.js (v24) on Windows cannot parse the service account private key due to OpenSSL limitations. The solution is to run the migration on GitHub Actions where Node.js has proper OpenSSL support.

## Solution: Run Migration via GitHub Actions

### Prerequisites
- Your service account JSON file from Firebase
- This repository pushed to GitHub

### Steps

1. **Add the service account as a GitHub Secret:**
   - Go to your GitHub repo → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `FIREBASE_SERVICE_ACCOUNT_JSON`
   - Value: Copy the entire content of your `service-account.json` file

2. **Trigger the migration workflow:**
   - Go to Actions tab → "Migrate to Firestore"
   - Click "Run workflow" button
   - Wait for the workflow to complete

3. **Check results:**
   - All data from `scripts/seeds/*.json` will be upserted to your Firestore database
   - Collections: `requests`, `campaigns`, `volunteers`, `notifications`

### What Gets Migrated
- `scripts/seeds/requests.json` → `requests` collection
- `scripts/seeds/campaigns.json` → `campaigns` collection  
- `scripts/seeds/volunteers.json` → `volunteers` collection
- `scripts/seeds/notifications.json` → `notifications` collection

### Local Testing (if needed)
The app already has real-time Firestore listeners set up in `DataContext.tsx`. Once migration is complete:
1. Run `pnpm dev` in `artifacts/mobile`
2. App will fetch live data from Firestore automatically
3. Seed data acts as fallback if collections are empty

---

**Status:** ✅ App is fully configured for Firestore. Only the initial migration needs to run on CI.
