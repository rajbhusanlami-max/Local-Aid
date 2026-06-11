import "react-native-get-random-values";
import Constants from "expo-constants";
import { getApp, getApps, initializeApp } from "firebase/app";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

type FirebaseConfig = {
  apiKey: string;
  authDomain?: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
  measurementId?: string;
};

const expoConfig = Constants.expoConfig ?? Constants.manifest ?? {};
const extra = (expoConfig.extra ?? {}) as Record<string, string | undefined>;

const projectId =
  extra.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? extra.FIREBASE_PROJECT_ID ?? "local-aid-demo";

const firebaseConfig: FirebaseConfig = {
  apiKey: extra.EXPO_PUBLIC_FIREBASE_API_KEY ?? extra.FIREBASE_API_KEY ?? "",
  authDomain: extra.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? extra.FIREBASE_AUTH_DOMAIN,
  projectId,
  storageBucket: extra.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? extra.FIREBASE_STORAGE_BUCKET,
  messagingSenderId:
    extra.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? extra.FIREBASE_MESSAGING_SENDER_ID,
  appId: extra.EXPO_PUBLIC_FIREBASE_APP_ID ?? extra.FIREBASE_APP_ID ?? "",
  measurementId:
    extra.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID ?? extra.FIREBASE_MEASUREMENT_ID,
};

const emulatorHostAndPort =
  extra.EXPO_PUBLIC_FIRESTORE_EMULATOR_HOST ?? extra.FIRESTORE_EMULATOR_HOST;
const emulatorPort = extra.EXPO_PUBLIC_FIRESTORE_EMULATOR_PORT ?? extra.FIRESTORE_EMULATOR_PORT;
const emulatorConfigured = Boolean(emulatorHostAndPort || emulatorPort);
const useEmulatorOnly = !firebaseConfig.apiKey || !firebaseConfig.appId;

if (useEmulatorOnly && !emulatorConfigured) {
  throw new Error(
    "[mobile/lib/firebase] Missing Firebase configuration. Set EXPO_PUBLIC_FIREBASE_API_KEY, EXPO_PUBLIC_FIREBASE_PROJECT_ID, and EXPO_PUBLIC_FIREBASE_APP_ID, or set EXPO_PUBLIC_FIRESTORE_EMULATOR_HOST/EXPO_PUBLIC_FIRESTORE_EMULATOR_PORT for local emulator use.",
  );
}

const effectiveConfig: FirebaseConfig = useEmulatorOnly
  ? {
      apiKey: "demo",
      authDomain: `${projectId}.firebaseapp.com`,
      projectId,
      appId: "1:demo:web:demo",
    }
  : firebaseConfig;

if (!effectiveConfig.apiKey || !effectiveConfig.projectId || !effectiveConfig.appId) {
  throw new Error(
    "[mobile/lib/firebase] Missing Firebase configuration. Set EXPO_PUBLIC_FIREBASE_API_KEY, EXPO_PUBLIC_FIREBASE_PROJECT_ID, and EXPO_PUBLIC_FIREBASE_APP_ID in app config or runtime environment.",
  );
}

const app = getApps().length > 0 ? getApp() : initializeApp(effectiveConfig);
const firestore = getFirestore(app);

if (emulatorHostAndPort || emulatorPort) {
  const hostPart = emulatorHostAndPort?.split(":")[0] ?? "localhost";
  const portPart = emulatorHostAndPort?.split(":")[1] ?? emulatorPort ?? "8080";
  const host = hostPart || "localhost";
  const port = Number(portPart);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error(
      `[mobile/lib/firebase] Invalid emulator port: ${emulatorPort ?? portPart}`,
    );
  }

  connectFirestoreEmulator(firestore, host, port);
}

export { firestore };
