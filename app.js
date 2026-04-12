import { initializeApp } from "https://gstatic.com";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "https://gstatic.com";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://gstatic.com";
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

let isVIP = false;

// 1. ბანერების სლაიდერი
async function loadBanners() {
    const track = document.getElementById('bannerTrack');
    const dots = document.getElementById('dots');
    const snap = await getDocs(query(collection(db, "banners"), orderBy("createdAt", "desc")));
    if (snap.empty) return;
    track.innerHTML = ''; dots.innerHTML = '';
    snap.docs.slice(0, 5).forEach((doc, i) => {
        track.innerHTML += `<div class="banner-step"><img src="${doc.data().url}" class="w-full h-full object-cover"></div>`;
        dots.innerHTML += `<div class="w-1.5 h-1.5 rounded-full bg-white/40 transition-all duration-300" id="dot-${i}"></div>`;
    });
    let curr = 0;
    setInterval(() => {
        curr = (curr + 1) % Math.min(snap.size, 5);
        track.style.transform = `translateX(-${curr * 100}%)`;
        document.querySelectorAll('#dots div').forEach((d, idx) => {
            d.style.background = idx === curr ? 'white' : 'rgba(255,255,255,0.4)';
            d.style.width = idx === curr ? '15px' : '6px';
        });
    }, 5000);
}

// 2. პოსტების ჩატვირთვა
async function loadPosts() {
    const container = document.getElementById('postsContainer');
    const loader = document.getElementById('loader');
    try {
        const snap = await getDocs(query(collection(db, "ads"), orderBy("createdAt", "desc")));
        if (loader) loader.style.display = 'none';
        container.innerHTML = '';
        snap.forEach(docSnap => {
            const d = docSnap.data();
            const card = document.createElement('div');
            card.className = `bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer active:scale-95 transition-all duration-300 ${d.isVIP ? 'vip-card' : ''}`;
            card.onclick = () => window.location.href = `product.html?id=${docSnap.id}`;
            const firstImg = Array.isArray(d.images) ? d.images[0] : d.images;
            card.innerHTML = `
                <div class="relative h-64 bg-gray-100">
                    <img src="${firstImg}" class="w-full h-full object-cover">
                    ${d.isVIP ? '<div class="absolute top-3 right-3 bg-amber-400 text-white text-[9px] px-2 py-1 rounded-full font-black uppercase tracking-widest shadow-lg italic">👑 VIP</div>' : ''}
                </div>
                <div class="p-5">
                    <h3 class="font-black text-gray-800 text-lg mb-1 truncate uppercase italic">${d.title}</h3>
                    <div class="flex justify-between items-center"><p class="text-[10px] text-gray-400 font-bold uppercase italic tracking-widest"><i class="far fa-images mr-1"></i> ${Array.isArray(d.images) ? d.images.length : 1} ფოტო</p></div>
                </div>`;
            container.appendChild(card);
        });
    } catch (e) { console.error(e); }
}

// 3. განცხადების დამატება
const uploadForm = document.getElementById('uploadForm');
if (uploadForm) {
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('submitBtn'); const fileInput = document.getElementById('itemImages');
        btn.disabled = true; btn.innerHTML = 'იტვირთება...';
        try {
            const imageUrls = []; const files = fileInput.files;
            for (const file of files) {
                const sRef = ref(storage, `uploads/${Date.now()}-${file.name}`);
                await uploadBytes(sRef, file); const url = await getDownloadURL(sRef); imageUrls.push(url);
            }
            await addDoc(collection(db, "ads"), { title: document.getElementById('itemName').value, description: document.getElementById('itemDesc').value, images: imageUrls, isVIP, views: 0, createdAt: serverTimestamp() });
            alert("წარმატებით დაემატა!"); location.reload();
        } catch (e) { alert("შეცდომა!"); btn.disabled = false; }
    });
}

// 4. ადმინ ფუნქციები
window.loginAdmin = async () => {
    try { await signInWithEmailAndPassword(auth, document.getElementById('adminEmail').value, document.getElementById('adminPass').value); } 
    catch (e) { alert("შეცდომა!"); }
};

window.uploadBanner = async () => {
    const file = document.getElementById('adminBannerFile').files[0];
    if (!file) return;
    try {
        const sRef = ref(storage, `banners/${Date.now()}`);
        await uploadBytes(sRef, file); const url = await getDownloadURL(sRef);
        await addDoc(collection(db, "banners"), { url, createdAt: serverTimestamp() });
        alert("ბანერი დაემატა!"); location.reload();
    } catch (e) { alert("შეცდომა!"); }
};

onAuthStateChanged(auth, (user) => {
    if (user && user.email === 'admin@gmail.com') {
        document.getElementById('adminLoginForm')?.classList.add('hidden');
        document.getElementById('adminControls')?.classList.remove('hidden');
    }
});

loadBanners(); loadPosts();
