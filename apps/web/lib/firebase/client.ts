import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import {
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User
} from "firebase/auth";
import {
  connectFirestoreEmulator,
  getFirestore
} from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "AIzaSyCdmtU2_GNefRi_BqveAYDZlbh6Eaf2ujc",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "the-urban-radio.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "the-urban-radio",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "the-urban-radio.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "490784033428",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "1:490784033428:web:aeaecfdcf2be6b63f10281",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? "G-SNXX1X4Q8M"
};

export const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);
export const functionsClient = getFunctions(firebaseApp, "us-central1");

const useEmulators = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS !== "false";
let emulatorsConnected = false;

if (typeof window !== "undefined" && useEmulators && !emulatorsConnected) {
  connectAuthEmulator(
    firebaseAuth,
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_URL ?? "http://127.0.0.1:9099",
    { disableWarnings: true }
  );
  connectFirestoreEmulator(
    firestore,
    process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST ?? "127.0.0.1",
    Number(process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT ?? "8080")
  );
  connectFunctionsEmulator(
    functionsClient,
    process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_EMULATOR_HOST ?? "127.0.0.1",
    Number(process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_EMULATOR_PORT ?? "5001")
  );
  emulatorsConnected = true;
}

let analyticsInstance: Promise<Analytics | null> | null = null;

export function getFirebaseAnalytics() {
  if (typeof window === "undefined") {
    return Promise.resolve(null);
  }

  if (!analyticsInstance) {
    analyticsInstance = isSupported().then((supported) =>
      supported ? getAnalytics(firebaseApp) : null
    );
  }

  return analyticsInstance;
}

export function getFunctionsBaseUrl() {
  if (useEmulators) {
    const host = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_EMULATOR_HOST ?? "127.0.0.1";
    const port = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_EMULATOR_PORT ?? "5001";
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "the-urban-radio";
    return `http://${host}:${port}/${projectId}/us-central1`;
  }

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "the-urban-radio";
  return `https://us-central1-${projectId}.cloudfunctions.net`;
}

export const waitForAuthReady = () =>
  new Promise<User | null>((resolve) => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });

export const signUpWithEmail = async (email: string, password: string) =>
  createUserWithEmailAndPassword(firebaseAuth, email, password);

export const signInWithEmail = async (email: string, password: string) =>
  signInWithEmailAndPassword(firebaseAuth, email, password);

export const signOutUser = async () => signOut(firebaseAuth);
