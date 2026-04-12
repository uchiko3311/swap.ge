import { initializeApp } from "https://gstatic.com";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, serverTimestamp, doc, updateDoc, increment } from "https://gstatic.com";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://gstatic.com";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://gstatic.com";

// Firebase კონფიგურაცია
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

let isVIP = false; // სტატუსი (გადახდის შემდეგ იცვლება)

// 1. ბანერების ჩატვირთვა და სლაიდერი
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
        const size = Math.min(snap.size, 5);
        curr = (curr + 1) % size;
        track.style.transform = `translateX(-${curr * 100}%)`;
        document.querySelectorAll('#dots div').forEach((d, idx) => {
            d.style.background = idx === curr ? 'white' : 'rgba(255,255,255,0.4)';
            d.style.width = idx === curr ? '15px' : '6px';
        });
    }, 5000);
}

// 2. პოსტების (განცხადებების) ჩატვირთვა
async function loadPosts() {
    const container = document.getElementById('postsContainer');
    const loader = document.getElementById('loader');
    
    try {
        const q = query(collection(db, "ads"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        
        if (loader) loader.style.display = 'none';
        container.innerHTML = '';

        snap.forEach(docSnap => {
            const d = docSnap.data();
            const card = document.createElement('div');
            // VIP პოსტის სტილი
            card.className = `bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer active:scale-95 transition-all duration-300 ${d.isVIP ? 'border-amber-400 ring-1 ring-amber-200 shadow-amber-100' : ''}`;
            
            // დაჭერისას გადასვლა დეტალურ გვერდზე
            card.onclick = () => window.location.href = `product.html?id=${docSnap.id}`;
            
            const firstImage = Array.isArray(d.images) ? d.images[0] : d.images;

            card.innerHTML = `
                <div class="relative h-64 bg-gray-100">
                    <img src="${firstImage || 'https://placeholder.com'}" class="w-full h-full object-cover">
                    ${d.isVIP ? '<div class="absolute top-3 right-3 bg-amber-400 text-white text-[9px] px-2 py-1 rounded-full font-black uppercase tracking-widest shadow-lg"><i class="fas fa-crown mr-1"></i> VIP</div>' : ''}
                </div>
                <div class="p-5">
                    <h3 class="font-black text-gray-800 text-lg mb-1 truncate uppercase italic tracking-tighter">${d.title}</h3>
                    <div class="flex justify-between items-center">
                        <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">
                            <i class="far fa-images mr-1 text-blue-500"></i> ${Array.isArray(d.images) ? d.images.length : 1} ფოტო
                        </p>
                        <span class="text-[9px] text-gray-300 font-bold">${new Date(d.createdAt?.toDate()).toLocaleDateString('ka-GE')}</span>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error("Posts Load Error:", error);
    }
}

// 3. განცხადების დამატება
const uploadForm = document.getElementById('uploadForm');
if (uploadForm) {
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('submitBtn');
        const fileInput = document.getElementById('itemImages');
        
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> მიმდინარეობს განთავსება...';

        try {
            const imageUrls = [];
            const files = fileInput.files;

            for (const file of files) {
                const sRef = ref(storage, `uploads/${Date.now()}-${file.name}`);
                const snapshot = await uploadBytes(sRef, file);
                const url = await getDownloadURL(snapshot.ref);
                imageUrls.push(url);
            }

            await addDoc(collection(db, "ads"), {
                title: document.getElementById('itemName').value,
                description: document.getElementById('itemDesc').value,
                images: imageUrls,
                isVIP: isVIP,
                views: 0,
                createdAt: serverTimestamp(),
                expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000)
            });

            alert("განცხადება წარმატებით განთავსდა!");
            location.reload();
        } catch (error) {
            alert("შეცდომა ატვირთვისას!");
            btn.disabled = false;
            btn.innerText = "გამოქვეყნება";
        }
    });
}

// 4. ადმინ ფუნქციები
window.loginAdmin = async () => {
    const email = document.getElementById('adminEmail').value;
    const pass = document.getElementById('adminPass').value;
    try {
        await signInWithEmailAndPassword(auth, email, pass);
    } catch (e) { alert("წვდომა უარყოფილია!"); }
};

window.uploadBanner = async () => {
    const file = document.getElementById('adminBannerFile').files[0];
    if (!file) return alert("აირჩიეთ ფაილი!");
    const btn = document.getElementById('bannerUploadBtn');
    
    btn.disabled = true;
    btn.innerText = "იტვირთება...";

    try {
        const sRef = ref(storage, `banners/${Date.now()}-${file.name}`);
        await uploadBytes(sRef, file);
        const url = await getDownloadURL(sRef);
        await addDoc(collection(db, "banners"), { url, createdAt: serverTimestamp() });
        alert("ბანერი დაემატა!");
        location.reload();
    } catch (e) { alert("შეცდომა!"); btn.disabled = false; }
};

// ადმინ სტატუსის კონტროლი
onAuthStateChanged(auth, (user) => {
    if (user && user.email === 'admin@gmail.com') {
        const loginForm = document.getElementById('adminLoginForm');
        const controls = document.getElementById('adminControls');
        if (loginForm) loginForm.classList.add('hidden');
        if (controls) controls.classList.remove('hidden');
    }
});

// გადახდის ღილაკი
const payBtn = document.getElementById('payBtn');
if (payBtn) {
    payBtn.addEventListener('click', async () => {
        payBtn.innerText = "კავშირი ბანკთან...";
        try {
            const res = await fetch('/api/pay', { method: 'POST' });
            const data = await res.json();
            if (data.url) window.location.href = data.url;
        } catch (e) { alert("შეცდომა!"); payBtn.innerText = "2.00 ₾"; }
    });
}

// ინიციალიზაცია
loadBanners();
loadPosts();
