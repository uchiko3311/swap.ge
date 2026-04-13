import "./auth.js";
import { uploadVideo } from "./upload.js";
import { db } from "./firebase.js";
import { collection, getDocs, updateDoc, doc, arrayUnion, query, orderBy } from "https://gstatic.com";

const container = document.getElementById("videos");
document.getElementById("uploadBtn").onclick = uploadVideo;

async function loadVideos() {
    container.innerHTML = "იტვირთება...";
    const search = document.getElementById("search").value.toLowerCase();
    const q = query(collection(db, "videos"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    container.innerHTML = "";

    snap.forEach(s => {
        const data = s.data();
        if (!data.title.toLowerCase().includes(search)) return;

        const isYT = data.url.includes("youtube.com") || data.url.includes("embed");
        const media = isYT ? `<iframe src="${data.url}" allowfullscreen></iframe>` : `<video controls src="${data.url}"></video>`;

        const div = document.createElement("div");
        div.className = "video-card";
        div.innerHTML = `
            ${media}
            <h3>${data.title}</h3>
            <button class="like-btn" data-id="${s.id}" data-likes="${data.likes}">❤️ ${data.likes || 0}</button>
            <div class="comments">
                ${(data.comments || []).map(c => `<p>💬 ${c}</p>`).join("")}
                <input id="in-${s.id}" placeholder="კომენტარი...">
                <button class="comm-btn" data-id="${s.id}">გაგზავნა</button>
            </div>
        `;
        container.appendChild(div);
    });
}

// Event Listeners for Dynamic Buttons
container.onclick = async (e) => {
    const id = e.target.dataset.id;
    if (e.target.classList.contains("like-btn")) {
        await updateDoc(doc(db, "videos", id), { likes: parseInt(e.target.dataset.likes) + 1 });
        loadVideos();
    }
    if (e.target.classList.contains("comm-btn")) {
        const txt = document.getElementById(`in-${id}`).value;
        if (txt) {
            await updateDoc(doc(db, "videos", id), { comments: arrayUnion(txt) });
            loadVideos();
        }
    }
};

document.getElementById("search").oninput = loadVideos;
loadVideos();
