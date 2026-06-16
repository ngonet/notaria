import { initializeApp } from "firebase/app";
import {
  initializeAppCheck,
  ReCaptchaV3Provider,
  getLimitedUseToken,
  type AppCheck,
} from "firebase/app-check";

const firebaseConfig = {
  apiKey: "AIzaSyAn2A233ZY1y6C85uJvntgZFbENmWGg9C0",
  authDomain: "notaria-melipilla.firebaseapp.com",
  projectId: "notaria-melipilla",
  storageBucket: "notaria-melipilla.firebasestorage.app",
  messagingSenderId: "779761804768",
  appId: "1:779761804768:web:7acc598eb9889f9e94b785",
  measurementId: "G-20M1TGH872",
};

const app = initializeApp(firebaseConfig);

if (import.meta.env.DEV) {
  (self as unknown as Record<string, unknown>).FIREBASE_APPCHECK_DEBUG_TOKEN =
    true;
}

export const appCheck: AppCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider(
    "6LcVziEtAAAAAIHV0oppDC-fBRZ-Nwg5DMFLcLlp",
  ),
  isTokenAutoRefreshEnabled: true,
});

export async function getAppCheckHeader(): Promise<Record<string, string>> {
  try {
    const result = await Promise.race([
      getLimitedUseToken(appCheck),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("appcheck_timeout")), 5000),
      ),
    ]);
    return { "X-Firebase-AppCheck": result.token };
  } catch {
    return {};
  }
}
