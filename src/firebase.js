import { initializeApp } from "https://gstatic.com";
import { getFirestore } from "https://gstatic.com";
import { getAuth } from "https://gstatic.com";
import { getStorage } from "https://gstatic.com";

const firebaseConfig = {
  apiKey: "AIzaSyAEUjh_mVRLTzUecRJbeG_K6gTp__FVft0",
  authDomain: "://firebaseapp.com",
  projectId: "swap-39e13",
  storageBucket: "swap-39e13.firebasestorage.app",
  messagingSenderId: "107187341554",
  appId: "1:107187341554:web:75533a380b58a7a141286b"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
