import { storage, db } from "./firebase.js";
import {
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { addDoc, collection } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.uploadVideo = async () => {
  const file = document.getElementById("file").files[0];
  const title = document.getElementById("title").value;
  const urlInput = document.getElementById("url").value;

  // თუ YouTube ლინკია
  if (urlInput) {
    await addDoc(collection(db, "videos"), {
      title,
      url: urlInput,
      likes: 0,
      comments: []
    });
    location.reload();
    return;
  }

  // ფაილის ატვირთვა
  if (!file) return alert("აირჩიე ფაილი");

  const storageRef = ref(storage, "videos/" + file.name);
  await uploadBytes(storageRef, file);

  const url = await getDownloadURL(storageRef);

  await addDoc(collection(db, "videos"), {
    title,
    url,
    likes: 0,
    comments: []
  });

  location.reload();
};
