import { initializeApp } from "https://gstatic.com";
import { getAuth } from "https://gstatic.com";
import { getFirestore } from "https://gstatic.com";
import { getStorage } from "https://gstatic.com";

const firebaseConfig = {
  apiKey: "შენი_API_KEY",
  authDomain: "შენი_://firebaseapp.com",
  projectId: "შენი_პროექტი",
  storageBucket: "შენი_://appspot.com",
  messagingSenderId: "ID",
  appId: "APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
