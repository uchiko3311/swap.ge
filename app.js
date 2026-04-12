// USER
let currentUser = localStorage.getItem("user") || null;

// DATA
let ads = JSON.parse(localStorage.getItem("ads") || "[]");

// NAVIGATION
function show(id){
    document.querySelectorAll(".container").forEach(div=>{
        div.classList.add("hidden");
    });
    document.getElementById(id).classList.remove("hidden");
}

// LOGIN
function login(){
    const username = document.getElementById("user").value;
    const password = document.getElementById("pass").value;

    if(!username || !password){
        alert("შეავსე ყველა ველი");
        return;
    }

    currentUser = username;
    localStorage.setItem("user", username);

    alert("შესული ხარ: " + username);
    show("home");
    loadAds();
}

// LOGOUT
function logout(){
    currentUser = null;
    localStorage.removeItem("user");
    alert("გამოსული ხარ");
    show("home");
}

// CREATE AD
function createAd(){

    if(!currentUser){
        alert("გაიარე ავტორიზაცია");
        return;
    }

    const userAds = ads.filter(a=>a.user === currentUser);

    // VIP ლოგიკა
    let isVIP = document.getElementById("vip").checked;

    if(userAds.length >=5 && !isVIP){
        alert("5 განცხადებაზე მეტი → საჭიროა VIP (2 ლარი)");
        return;
    }

    // ფოტოები (split comma)
    const images = document.getElementById("img").value.split(",");

    // ლიმიტები
    if(!isVIP && images.length > 7){
        alert("უფასო მაქს 7 ფოტო");
        return;
    }

    if(isVIP && images.length > 14){
        alert("VIP მაქს 14 ფოტო");
        return;
    }

    const ad = {
        id: Date.now(),
        title: document.getElementById("title").value,
        desc: document.getElementById("desc").value,
        images: images,
        vip: isVIP,
        user: currentUser,
        createdAt: Date.now()
    };

    ads.push(ad);
    localStorage.setItem("ads", JSON.stringify(ads));

    alert("დამატებულია");
    loadAds();
    loadMyAds();
    show("home");
}

// DELETE AD
function deleteAd(id){
    ads = ads.filter(a => a.id !== id);
    localStorage.setItem("ads", JSON.stringify(ads));
    loadAds();
    loadMyAds();
}

// LOAD ALL ADS
function loadAds(){

    const container = document.getElementById("ads");
    if(!container) return;

    container.innerHTML = "";

    // VIP ვერ ხედავს უფასოს
    let visibleAds = ads;

    if(currentUser){
        visibleAds = ads.filter(a=>{
            if(a.vip) return true;
            return false;
        });
    }

    visibleAds.forEach(ad=>{
        container.innerHTML += `
        <div class="ad ${ad.vip ? "vip":""}">
            <img src="${ad.images[0] || ''}">
            <h3>${ad.title}</h3>
            <p>${ad.desc}</p>
        </div>
        `;
    });
}

// LOAD USER ADS
function loadMyAds(){

    const container = document.getElementById("myAds");
    if(!container) return;

    container.innerHTML = "";

    const myAds = ads.filter(a=>a.user === currentUser);

    myAds.forEach(ad=>{
        container.innerHTML += `
        <div class="ad ${ad.vip ? "vip":""}">
            <img src="${ad.images[0] || ''}">
            <h3>${ad.title}</h3>
            <button onclick="deleteAd(${ad.id})">წაშლა</button>
        </div>
        `;
    });
}

// SEARCH
document.getElementById("search")?.addEventListener("input", function(){
    const value = this.value.toLowerCase();
    const container = document.getElementById("ads");

    container.innerHTML = "";

    ads
    .filter(a => a.title.toLowerCase().includes(value))
    .forEach(ad=>{
        container.innerHTML += `
        <div class="ad ${ad.vip ? "vip":""}">
            <img src="${ad.images[0] || ''}">
            <h3>${ad.title}</h3>
        </div>
        `;
    });
});

// CHAT
function sendMsg(){

    const input = document.getElementById("chatInput");
    const box = document.getElementById("chatBox");

    if(!input.value) return;

    const name = currentUser || "Guest";

    box.innerHTML += `<div><b>${name}:</b> ${input.value}</div>`;
    box.scrollTop = box.scrollHeight;

    input.value = "";
}

// AUTO DELETE 30 DAYS
setInterval(()=>{
    const now = Date.now();

    ads = ads.filter(ad => now - ad.createdAt < 30 * 24 * 60 * 60 * 1000);

    localStorage.setItem("ads", JSON.stringify(ads));
    loadAds();
    loadMyAds();

}, 60000);

// INIT
window.onload = () => {
    loadAds();
    loadMyAds();
};
