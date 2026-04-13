import { storage, db, auth } from "./firebase.js";
import { ref, uploadBytes, getDownloadURL } from "https://gstatic.com";
import { addDoc, collection, serverTimestamp } from "https://gstatic.com";

function formatYouTubeUrl(url) {
    if (url.includes("watch?v=")) return url.replace("watch?v=", "embed/");
    if (url.includes("youtu.be/")) return `https://youtube.com{url.split("/").pop()}`;
    return url;
}

export async function uploadVideo() {
    if (!auth.currentUser) return alert("გთხოვთ გაიაროთ ავტორიზაცია!");

    const title = document.getElementById("title").value;
    let url = document.getElementById("url").value;
    const file = document.getElementById("file").files[0];

    if (!title) return alert("შეიყვანეთ სათაური");

    try {
        if (url) {
            url = formatYouTubeUrl(url);
        } else if (file) {
            const sRef = ref(storage, `videos/${Date.now()}_${file.name}`);
            const snap = await uploadBytes(sRef, file);
            url = await getDownloadURL(snap.ref);
        } else {
            return alert("აირჩიეთ ფაილი ან ჩასვით ლინკი");
        }

        await addDoc(collection(db, "videos"), {
            title, url, likes: 0, comments: [], createdAt: serverTimestamp()
        });
        location.reload();
    } catch (e) { alert(e.message); }
}
