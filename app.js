const firebaseConfig = {
apiKey:"YOUR_KEY",
authDomain:"YOUR_DOMAIN",
projectId:"YOUR_PROJECT"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

let user=null;

/* AUTH */
function signup(){
auth.createUserWithEmailAndPassword(email.value,pass.value);
}

function login(){
auth.signInWithEmailAndPassword(email.value,pass.value);
}

auth.onAuthStateChanged(u=>{
user=u;
if(user){
document.getElementById("auth").style.display="none";
document.getElementById("app").style.display="block";
loadPosts();
}
});

/* POSTS */
function addPost(){
db.collection("posts").add({
title:prompt("Title"),
price:prompt("Price"),
time:Date.now()
});
}

function loadPosts(){
db.collection("posts").orderBy("time","desc")
.onSnapshot(s=>{
let box=document.getElementById("posts");
box.innerHTML="";

s.forEach(d=>{
let p=d.data();
box.innerHTML+=`
<div class="card">
<h3>${p.title}</h3>
<p>${p.price}</p>
</div>`;
});
});
}
