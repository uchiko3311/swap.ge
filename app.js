import { initializeApp } from "https://gstatic.com";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "https://gstatic.com";
import { getAuth, signInWithEmailAndPassword } from "https://gstatic.com";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://gstatic.com";

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
const storage = getStorage(app);

// --- სლაიდერის მართვა ---
async function loadBanners() {
    const track = document.getElementById('bannerTrack');
    const dotsContainer = document.getElementById('dots');
    const snap = await getDocs(collection(db, "banners"));
    
    if (snap.empty) return;
    track.innerHTML = '';
    
    snap.forEach((doc, index) => {
        const data = doc.data();
        track.innerHTML += `<div class="banner-step h-44"><img src="${data.url}" class="w-full h-full object-cover"></div>`;
        dotsContainer.innerHTML += `<div class="w-2 h-2 rounded-full bg-white/50"></div>`;
    });

    let current = 0;
    setInterval(() => {
        current = (current + 1) % snap.size;
        track.style.transform = `translateX(-${current * 100}%)`;
    }, 4000); // 4 წამში ერთხელ მოძრაობა
}

// --- ადმინ ლოგიკა ---
window.loginAdmin = async () => {
    const email = document.getElementById('adminEmail').value;
    const pass = document.getElementById('adminPass').value;
    try {
        await signInWithEmailAndPassword(auth, email, pass);
        document.getElementById('adminLoginForm').classList.add('hidden');
        document.getElementById('adminControls').classList.remove('hidden');
    } catch (e) { alert("არასწორი მონაცემები!"); }
};

window.uploadBanner = async () => {
    const url = document.getElementById('bannerUrl').value;
    if (!url) return;
    await addDoc(collection(db, "banners"), { url, createdAt: serverTimestamp() });
    alert("ბანერი დაემატა!");
    location.reload();
};

// --- პოსტების ჩატვირთვა ---
async function loadPosts() {
    const container = document.getElementById('postsContainer');
    const q = query(collection(db, "ads"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    
    document.getElementById('loader').style.display = 'none';
    snap.forEach(doc => {
        const data = doc.data();
        container.innerHTML += `
            <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <img src="${data.images[0]}" class="w-full h-56 object-cover">
                <div class="p-4">
                    <h3 class="font-bold">${data.title}</h3>
                    <p class="text-xs text-gray-500">${data.description}</p>
                </div>
            </div>
        `;
    });
}

loadBanners();
loadPosts();
