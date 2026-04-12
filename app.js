import { initializeApp } from "https://gstatic.com";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://gstatic.com";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://gstatic.com";

// თქვენი კონფიგურაცია
const firebaseConfig = {
  apiKey: "AIzaSyAEUjh_mVRLTzUecRJbeG_K6gTp__FVft0",
  authDomain: "swap-39e13.firebaseapp.com",
  databaseURL: "https://swap-39e13-default-rtdb.firebaseio.com",
  projectId: "swap-39e13",
  storageBucket: "swap-39e13.firebasestorage.app",
  messagingSenderId: "107187341554",
  appId: "1:107187341554:web:75533a380b58a7a141286b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// დროებითი VIP სტატუსი (სანამ გადახდებს ჩავრთავთ)
let isVIP = false; 

const fileInput = document.getElementById('itemImages');
const uploadForm = document.getElementById('uploadForm');

// ფოტოების ლიმიტის შემოწმება (7 უფასოზე, 14 VIP-ზე)
fileInput.addEventListener('change', () => {
    const maxPhotos = isVIP ? 14 : 7;
    if (fileInput.files.length > maxPhotos) {
        alert(`თქვენი ლიმიტია ${maxPhotos} ფოტო!`);
        fileInput.value = "";
    }
});

// განცხადების ატვირთვის ფუნქცია
uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.innerText = "იტვირთება...";

    const name = document.getElementById('itemName').value;
    const desc = document.getElementById('itemDesc').value;
    const files = fileInput.files;

    try {
        const imageUrls = [];
        // ფოტოების ატვირთვა Storage-ში
        for (let file of files) {
            const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            imageUrls.push(url);
        }

        // მონაცემების შენახვა Firestore-ში
        await addDoc(collection(db, "ads"), {
            title: name,
            description: desc,
            images: imageUrls,
            isVIP: isVIP,
            createdAt: serverTimestamp(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 დღეში წაშლისთვის
        });

        alert("განცხადება წარმატებით დაემატა!");
        uploadForm.reset();
    } catch (error) {
        console.error(error);
        alert("შეცდომა ატვირთვისას!");
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = "განცხადების განთავსება";
    }
});
