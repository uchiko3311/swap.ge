import { initializeApp } from "https://gstatic.com";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://gstatic.com";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://gstatic.com";

const firebaseConfig = {
  apiKey: "AIzaSyAEUjh_mVRLTzUecRJbeG_K6gTp__FVft0",
  authDomain: "://firebaseapp.com",
  databaseURL: "https://firebaseio.com",
  projectId: "swap-39e13",
  storageBucket: "swap-39e13.firebasestorage.app",
  messagingSenderId: "107187341554",
  appId: "1:107187341554:web:75533a380b58a7a141286b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// სტატუსის მართვა
let isVIP = false; 

const fileInput = document.getElementById('itemImages');
const fileCount = document.getElementById('fileCount');
const limitNote = document.getElementById('limitNote');
const statusBadge = document.getElementById('statusBadge');

// ფოტოების რაოდენობის შემოწმება
fileInput.addEventListener('change', () => {
    const max = isVIP ? 14 : 7;
    if (fileInput.files.length > max) {
        alert(`თქვენი ლიმიტია ${max} ფოტო. გააქტიურეთ VIP მეტისთვის!`);
        fileInput.value = "";
        fileCount.innerText = "არჩეულია: 0";
    } else {
        fileCount.innerText = `არჩეულია: ${fileInput.files.length}`;
    }
});

// გადახდის ღილაკი
document.getElementById('payBtn').addEventListener('click', async () => {
    const btn = document.getElementById('payBtn');
    btn.disabled = true;
    btn.innerText = "ბანკთან კავშირი...";
    
    try {
        const res = await fetch('/api/pay', { method: 'POST' });
        const data = await res.json();
        if (data.url) window.location.href = data.url;
    } catch (e) {
        alert("გადახდა ვერ დაიწყო");
        btn.disabled = false;
        btn.innerText = "გააქტიურება - 2.00 ₾";
    }
});

// განცხადების ატვირთვა
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> იტვირთება...';

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
            isVIP: isVIP,
            createdAt: serverTimestamp(),
            expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 დღე
        });

        alert("განცხადება წარმატებით დაემატა!");
        location.reload();
    } catch (error) {
        alert("შეცდომა ატვირთვისას");
        btn.disabled = false;
        btn.innerText = "განთავსება";
    }
});
