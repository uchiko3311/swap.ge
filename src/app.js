import "./auth.js";
import "./upload.js";
import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const container = document.getElementById("videos");

async function loadVideos() {
  container.innerHTML = "";

  const search = document.getElementById("search").value.toLowerCase();

  const snapshot = await getDocs(collection(db, "videos"));

  snapshot.forEach(docSnap => {
    const data = docSnap.data();

    if (!data.title.toLowerCase().includes(search)) return;

    const div = document.createElement("div");
    div.className = "video";

    div.innerHTML = `
      <video controls src="${data.url}"></video>
      <h3>${data.title}</h3>

      <button onclick="like('${docSnap.id}', ${data.likes || 0})">
        ❤️ ${data.likes || 0}
      </button>

      <div class="comments">
        <input id="c-${docSnap.id}" placeholder="კომენტარი">
        <button onclick="comment('${docSnap.id}')">Send</button>
        <div>${(data.comments || []).join("<br>")}</div>
      </div>
    `;

    container.appendChild(div);
  });
}

window.like = async (id, likes) => {
  await updateDoc(doc(db, "videos", id), {
    likes: likes + 1
  });
  loadVideos();
};

window.comment = async (id) => {
  const input = document.getElementById(`c-${id}`);
  const text = input.value;

  const snapshot = await getDocs(collection(db, "videos"));

  snapshot.forEach(async docSnap => {
    if (docSnap.id === id) {
      const data = docSnap.data();
      const comments = data.comments || [];
      comments.push(text);

      await updateDoc(doc(db, "videos", id), { comments });
      loadVideos();
    }
  });
};

document.getElementById("search").addEventListener("input", loadVideos);

loadVideos();
