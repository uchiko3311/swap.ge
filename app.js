// ===== STATE =====
const state = {
    user: localStorage.getItem("user") || null,
    ads: JSON.parse(localStorage.getItem("ads") || "[]"),
    filter: ""
};

// ===== SAVE =====
function save(){
    localStorage.setItem("ads", JSON.stringify(state.ads));
}

// ===== NAV =====
function show(page){
    document.querySelectorAll(".container")
        .forEach(el => el.classList.add("hidden"));

    document.getElementById(page).classList.remove("hidden");
}

// ===== LOGIN =====
function login(){
    const user = document.getElementById("user").value;
    const pass = document.getElementById("pass").value;

    if(!user || !pass){
        return alert("შეავსე ველები");
    }

    state.user = user;
    localStorage.setItem("user", user);

    show("home");
    render();
}

// ===== LOGOUT =====
function logout(){
    state.user = null;
    localStorage.removeItem("user");
    render();
}

// ===== CREATE AD =====
function createAd(){

    if(!state.user){
        return alert("გაიარე ავტორიზაცია");
    }

    const userAds = state.ads.filter(a => a.user === state.user);
    const isVIP = document.getElementById("vip").checked;
    const images = document.getElementById("img").value.split(",");

    // LIMITS
    if(!isVIP && userAds.length >= 5){
        return alert("VIP საჭიროა (2 ლარი)");
    }

    if(!isVIP && images.length > 7){
        return alert("მაქს 7 ფოტო");
    }

    if(isVIP && images.length > 14){
        return alert("მაქს 14 ფოტო");
    }

    const ad = {
        id: Date.now(),
        title: title.value,
        desc: desc.value,
        images,
        vip: isVIP,
        user: state.user,
        createdAt: Date.now()
    };

    state.ads.push(ad);
    save();
    render();
    show("home");
}

// ===== DELETE =====
function deleteAd(id){
    state.ads = state.ads.filter(a => a.id !== id);
    save();
    render();
}

// ===== FILTER =====
function getFilteredAds(){

    let data = [...state.ads];

    // SEARCH
    if(state.filter){
        data = data.filter(a =>
            a.title.toLowerCase().includes(state.filter)
        );
    }

    // VIP FILTER
    if(state.user){
        data = data.filter(a => a.vip);
    }

    return data;
}

// ===== RENDER ADS =====
function renderAds(){

    const container = document.getElementById("ads");
    if(!container) return;

    const ads = getFilteredAds();

    container.innerHTML = ads.map(ad => `
        <div class="ad ${ad.vip ? "vip":""}">
            <img src="${ad.images[0] || ""}">
            <h3>${ad.title}</h3>
            <p>${ad.desc}</p>
        </div>
    `).join("");
}

// ===== RENDER CABINET =====
function renderCabinet(){

    const container = document.getElementById("myAds");
    if(!container) return;

    const myAds = state.ads.filter(a => a.user === state.user);

    container.innerHTML = myAds.map(ad => `
        <div class="ad ${ad.vip ? "vip":""}">
            <img src="${ad.images[0] || ""}">
            <h3>${ad.title}</h3>
            <button onclick="deleteAd(${ad.id})">წაშლა</button>
        </div>
    `).join("");
}

// ===== MAIN RENDER =====
function render(){
    renderAds();
    renderCabinet();
}

// ===== SEARCH =====
document.getElementById("search")?.addEventListener("input", (e)=>{
    state.filter = e.target.value.toLowerCase();
    render();
});

// ===== CHAT =====
function sendMsg(){

    const input = document.getElementById("chatInput");
    const box = document.getElementById("chatBox");

    if(!input.value) return;

    const name = state.user || "Guest";

    box.innerHTML += `<div><b>${name}:</b> ${input.value}</div>`;
    box.scrollTop = box.scrollHeight;

    input.value = "";
}

// ===== AUTO DELETE =====
setInterval(()=>{
    const now = Date.now();

    state.ads = state.ads.filter(ad =>
        now - ad.createdAt < 30 * 24 * 60 * 60 * 1000
    );

    save();
    render();

}, 60000);

// ===== INIT =====
window.onload = render;
