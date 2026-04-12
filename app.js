import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, serverTimestamp, doc, setDoc, getDoc } 
from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import { getStorage, ref, uploadBytes, getDownloadURL } 
from "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

let user = null;
let vip = false;

const postsDiv = document.getElementById("posts");

/* ================= AUTH ================= */

window.register = async () => {
  const email = prompt("Email");
  const pass = prompt("Password");

  const res = await createUserWithEmailAndPassword(auth, email, pass);

  await setDoc(doc(db, "users", res.user.uid), {
    email,
    vip: false
  });

  alert("რეგისტრაცია OK");
};

window.login = async () => {
  const email = prompt("Email");
  const pass = prompt("Password");

  await signInWithEmailAndPassword(auth, email, pass);

  alert("შესვლა OK");
};

onAuthStateChanged(auth, async (u) => {
  if (u) {
    user = u;

    const refUser = doc(db, "users", u.uid);
    const snap = await getDoc(refUser);

    if (snap.exists()) vip = snap.data().vip;

    loadPosts();
  }
});

/* ================= VIP ================= */

window.buyVIP = async () => {
  if (!user) return alert("Login first");

  const res = await fetch("http://localhost:3000/create-checkout");
  const data = await res.json();

  window.location.href = data.url;
};

/* ================= POST ================= */

document.getElementById("postBtn").addEventListener("click", async () => {

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
});

/* ================= LOAD ================= */

async function loadPosts() {
  postsDiv.innerHTML = "";

  const snap = await getDocs(collection(db, "ads"));

  let vipAds = [];
  let normalAds = [];

  snap.forEach(d => {
    const data = d.data();
    if (data.vip) vipAds.push(data);
    else normalAds.push(data);
  });

  [...vipAds, ...normalAds].forEach(d => {
    const div = document.createElement("div");
    div.className = "post " + (d.vip ? "vip" : "");

    div.innerHTML = `
      ${d.vip ? "👑 VIP" : ""}
      <img src="${d.image}" width="100%">
      <h3>${d.title}</h3>
      <p>${d.description}</p>
    `;

    postsDiv.appendChild(div);
  });
      }
