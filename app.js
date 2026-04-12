import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getFirestore, collection, addDoc, getDocs, serverTimestamp, doc, setDoc, getDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

import {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
  getStorage, ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js";

const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_ID",
  storageBucket: "YOUR_BUCKET",
  appId: "YOUR_APP"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

let user = null;
let vip = false;

/* AUTH */
window.register = async () => {
  const email = prompt("Email");
  const pass = prompt("Password");
  const res = await createUserWithEmailAndPassword(auth, email, pass);

  await setDoc(doc(db, "users", res.user.uid), {
    email,
    vip: false
  });
};

window.login = async () => {
  const email = prompt("Email");
  const pass = prompt("Password");
  await signInWithEmailAndPassword(auth, email, pass);
};

onAuthStateChanged(auth, async (u) => {
  if (u) {
    user = u;
    const snap = await getDoc(doc(db, "users", u.uid));
    if (snap.exists()) vip = snap.data().vip;
    loadPosts();
  }
});

/* VIP (backend redirect) */
window.buyVIP = async () => {
  const res = await fetch("https://YOUR-BACKEND.com/create-payment", {
    method: "POST",
    body: JSON.stringify({ uid: user.uid, amount: 2 }),
    headers: { "Content-Type": "application/json" }
  });

  const data = await res.json();
  window.location.href = data.url;
};

/* POST */
document.getElementById("postBtn").onclick = async () => {
  const title = document.getElementById("title").value;
  const desc = document.getElementById("desc").value;
  const file = document.getElementById("file").files[0];

  const imgRef = ref(storage, "ads/" + Date.now());
  await uploadBytes(imgRef, file);
  const url = await getDownloadURL(imgRef);

  await addDoc(collection(db, "ads"), {
    title,
    description: desc,
    image: url,
    vip,
    createdAt: serverTimestamp()
  });

  loadPosts();
};

/* LOAD */
async function loadPosts() {
  const snap = await getDocs(collection(db, "ads"));
  const box = document.getElementById("posts");

  box.innerHTML = "";

  let vipAds = [];
  let normal = [];

  snap.forEach(d => {
    const data = d.data();
    if (data.vip) vipAds.push(data);
    else normal.push(data);
  });

  [...vipAds, ...normal].forEach(d => {
    box.innerHTML += `
      <div class="post ${d.vip ? 'vip' : ''}">
        ${d.vip ? "👑 VIP" : ""}
        <img src="${d.image}" width="100%">
        <h3>${d.title}</h3>
        <p>${d.description}</p>
      </div>
    `;
  });
                              }
