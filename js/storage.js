import { storage } from './firebase-config.js';
import { ref, uploadBytes, getDownloadURL } from "https://gstatic.com";

export async function uploadImages(files, userId) {
    const urls = [];
    for (let file of files) {
        if (urls.length >= 14) break; // ლიმიტი 14 ფოტო
        const storageRef = ref(storage, `items/${userId}/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        urls.push(url);
    }
    return urls;
}
