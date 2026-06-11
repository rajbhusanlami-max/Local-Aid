import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import Constants from "expo-constants";

function getEnv(name: string): string | undefined {
  if (typeof process !== "undefined" && process.env && process.env[name]) return process.env[name];
  const expoConfig = (Constants && (Constants.expoConfig ?? Constants.manifest)) || {};
  const extra = (expoConfig.extra ?? {}) as Record<string, string | undefined>;
  return extra[name] ?? undefined;
}

const apiKey = getEnv("EXPO_PUBLIC_FIREBASE_API_KEY");
const authDomain = getEnv("EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN");
const projectId = getEnv("EXPO_PUBLIC_FIREBASE_PROJECT_ID");
const storageBucket = getEnv("EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET");
const messagingSenderId = getEnv("EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID");
const appId = getEnv("EXPO_PUBLIC_FIREBASE_APP_ID");
const emulatorHost = getEnv("EXPO_PUBLIC_FIRESTORE_EMULATOR_HOST");
const emulatorPort = getEnv("EXPO_PUBLIC_FIRESTORE_EMULATOR_PORT");

if (!projectId) {
  throw new Error("[lib/firebaseClient] Missing EXPO_PUBLIC_FIREBASE_PROJECT_ID");
}

const config: any = {
  apiKey: apiKey ?? "",
  authDomain: authDomain,
  projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId ?? "",
};

const app = getApps().length > 0 ? getApp() : initializeApp(config);
const db = getFirestore(app);

// If emulator host/port are provided, connect to the local Firestore emulator.
if (emulatorHost && emulatorPort) {
  try {
    connectFirestoreEmulator(db, emulatorHost, parseInt(emulatorPort, 10));
    // eslint-disable-next-line no-console
    console.info("Connected to Firestore emulator at", `${emulatorHost}:${emulatorPort}`);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("Failed to connect to Firestore emulator:", e);
  }
}

export { db };
