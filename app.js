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

// 1. ბანერების სლაიდერი
async function loadBanners() {
    const track = document.getElementById('bannerTrack');
    const snap = await getDocs(query(collection(db, "banners"), orderBy("createdAt", "desc")));
    if (snap.empty) return;
    track.innerHTML = '';
    snap.docs.slice(0, 5).forEach((doc) => {
        track.innerHTML += `<div class="banner-step"><img src="${doc.data().url}" style="width:100%; height:100%; object-fit:cover;"></div>`;
    });
    let curr = 0;
    setInterval(() => {
        curr = (curr + 1) % Math.min(snap.size, 5);
        track.style.transform = `translateX(-${curr * 100}%)`;
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
            card.className = 'post-card';
            card.onclick = () => window.location.href = `product.html?id=${docSnap.id}`;
            const firstImg = Array.isArray(d.images) ? d.images[0] : d.images;
            card.innerHTML = `
                <img src="${firstImg}" class="post-img">
                <div class="post-info">
                    <h3 class="post-title">${d.title}</h3>
                    <p style="font-size:12px; color:#666; margin-bottom:10px;">${d.description.substring(0, 50)}...</p>
                    <div style="display:flex; justify-content:space-between; font-size:10px; color:#aaa; font-weight:bold; text-transform:uppercase;">
                        <span><i class="far fa-images"></i> ${Array.isArray(d.images) ? d.images.length : 1} ფოტო</span>
                        <span>${new Date(d.createdAt?.toDate()).toLocaleDateString('ka-GE')}</span>
                    </div>
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
        const btn = document.getElementById('submitBtn');
        const fileInput = document.getElementById('itemImages');
        btn.disabled = true; btn.innerText = 'იტვირთება...';
        try {
            const imageUrls = [];
            for (const file of fileInput.files) {
                const sRef = ref(storage, `uploads/${Date.now()}-${file.name}`);
                await uploadBytes(sRef, file);
                imageUrls.push(await getDownloadURL(sRef));
            }
            await addDoc(collection(db, "ads"), { 
                title: document.getElementById('itemName').value, 
                description: document.getElementById('itemDesc').value, 
                images: imageUrls, 
                isVIP: false, 
                views: 0, 
                createdAt: serverTimestamp() 
            });
            alert("წარმატებით დაემატა!"); location.reload();
        } catch (e) { alert("შეცდომა!"); btn.disabled = false; btn.innerText = 'გამოქვეყნება'; }
    });
}

// 4. ადმინ ფუნქციები
window.uploadBanner = async () => {
    const file = document.getElementById('adminBannerFile').files[0];
    if (!file) return;
    try {
        const sRef = ref(storage, `banners/${Date.now()}`);
        await uploadBytes(sRef, file);
        const url = await getDownloadURL(sRef);
        await addDoc(collection(db, "banners"), { url, createdAt: serverTimestamp() });
        alert("ბანერი დაემატა!"); location.reload();
    } catch (e) { alert("შეცდომა!"); }
};

loadBanners(); loadPosts();
