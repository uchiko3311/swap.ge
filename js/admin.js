import { initializeApp } from "https://gstatic.com";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://gstatic.com";
import { getAuth, onAuthStateChanged } from "https://gstatic.com";

const firebaseConfig = {
  apiKey: "AIzaSyAEUjh_mVRLTzUecRJbeG_K6gTp__FVft0",
  authDomain: "://firebaseapp.com",
  projectId: "swap-39e13",
  storageBucket: "swap-39e13.firebasestorage.app",
  messagingSenderId: "107187341554",
  appId: "1:107187341554:web:75533a380b58a7a141286b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// მხოლოდ ადმინისტრატორის დაშვება (მაგალითად, შენი მეილით)
const ADMIN_EMAIL = "uchiko3311@gmail.com"; // ჩაწერე შენი მეილი

onAuthStateChanged(auth, (user) => {
    if (!user || user.email !== ADMIN_EMAIL) {
        alert("წვდომა აკრძალულია!");
        window.location.href = "index.html";
    }
});

// განცხადების დამატება
document.getElementById('admin-form').onsubmit = async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.disabled = true;
    btn.innerText = "ქვეყნდება...";

    try {
        await addDoc(collection(db, "items"), {
            title: document.getElementById('title').value,
            price: document.getElementById('price').value,
            description: document.getElementById('description').value,
            imageUrl: document.getElementById('imageUrl').value,
            createdAt: serverTimestamp(),
            userId: auth.currentUser.uid
        });

        alert("✅ განცხადება წარმატებით გამოქვეყნდა!");
        e.target.reset();
    } catch (error) {
        console.error(error);
        alert("❌ შეცდომა!");
    } finally {
        btn.disabled = false;
        btn.innerText = "გამოქვეყნება";
    }
};
