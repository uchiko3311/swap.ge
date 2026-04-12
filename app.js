// CLEAN STATE
const state = {
    user: localStorage.getItem("user"),
    ads: JSON.parse(localStorage.getItem("ads") || "[]"),
    search: ""
};

// SAVE
function save(){
    localStorage.setItem("ads", JSON.stringify(state.ads));
}

// NAVIGATION
function show(page){
    document.querySelectorAll(".container")
    .forEach(e=>e.classList.add("hidden"));

    document.getElementById(page).classList.remove("hidden");
}

// LOGIN
function login(){
    const user = document.getElementById("user").value;

    if(!user) return alert("შეიყვანე სახელი");

    state.user = user;
    localStorage.setItem("user", user);

    alert("შესული ხარ");
    show("home");
    render();
}

// CREATE AD
function createAd(){

    if(!state.user) return alert("ჯერ შედი სისტემაში");

    const images = img.value.split(",");

    const userAds = state.ads.filter(a=>a.user===state.user);

    const vip = document.getElementById("vip").checked;

    if(!vip && userAds.length >= 5)
        return alert("VIP საჭიროა");

    if(!vip && images.length > 7)
        return alert("7 ფოტო მაქს");

    if(vip && images.length > 14)
        return alert("14 ფოტო მაქს");

    state.ads.push({
        id:Date.now(),
        title:title.value,
        desc:desc.value,
        images,
        vip,
        user:state.user,
        date:Date.now()
    });

    save();
    render();
    show("home");
}

// DELETE
function deleteAd(id){
    state.ads = state.ads.filter(a=>a.id!==id);
    save();
    render();
}

// RENDER ADS
function renderAds(){

    const filtered = state.ads.filter(a=>
        a.title.toLowerCase().includes(state.search)
    );

    ads.innerHTML = filtered.map(a=>`
        <div class="ad ${a.vip?'vip':''}">
            <img src="${a.images[0]||''}">
            <h3>${a.title}</h3>
            <p>${a.desc}</p>
        </div>
    `).join("");
}

// CABINET
function renderCabinet(){

    const my = state.ads.filter(a=>a.user===state.user);

    myAds.innerHTML = my.map(a=>`
        <div class="ad ${a.vip?'vip':''}">
            <h3>${a.title}</h3>
            <button onclick="deleteAd(${a.id})">წაშლა</button>
        </div>
    `).join("");
}

// MAIN RENDER
function render(){
    renderAds();
    renderCabinet();
}

// SEARCH
search.oninput = e=>{
    state.search = e.target.value.toLowerCase();
    render();
};

// CHAT
function sendMsg(){
    chatBox.innerHTML += `<div>${state.user||"Guest"}: ${chatInput.value}</div>`;
    chatInput.value="";
}

// AUTO DELETE (30 days)
setInterval(()=>{
    const now = Date.now();
    state.ads = state.ads.filter(a=>now-a.date < 2592000000);
    save();
    render();
},60000);

// INIT
window.onload = render;
