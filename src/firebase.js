import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAEUjh_mVRLTzUecRJbeG_K6gTp__FVft0",
  authDomain: "swap-39e13.firebaseapp.com",
  projectId: "swap-39e13",
  storageBucket: "swap-39e13.firebasestorage.app",
  messagingSenderId: "107187341554",
  appId: "1:107187341554:web:75533a380b58a7a141286b"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
