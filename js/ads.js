// ადმინის მიერ ატვირთული 5 ბანერის წამოღება
import { db } from './firebase-config.js';
import { getDocs, collection } from "https://gstatic.com";

export async function loadBanners() {
    const querySnapshot = await getDocs(collection(db, "banners"));
    const bannerContainer = document.getElementById('admin-banners');
    bannerContainer.innerHTML = ""; // გასუფთავება
    
    querySnapshot.forEach((doc) => {
        const img = document.createElement('img');
        img.src = doc.data().url;
        img.className = "w-full h-full object-cover hidden slide"; // სლაიდერისთვის
        bannerContainer.appendChild(img);
    });
    startSlider(); // ფუნქცია რომელიც 5 წამში ერთხელ აჩვენებს შემდეგს
}
