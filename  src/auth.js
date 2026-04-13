import { auth } from "./firebase.js";
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from "https://gstatic.com";

const authDiv = document.getElementById("auth-container");

function updateUI(user) {
    if (user) {
        authDiv.innerHTML = `
            <span class="user-email">👤 ${user.email}</span>
            <button id="logoutBtn">გასვლა</button>
        `;
        document.getElementById("logoutBtn").onclick = () => signOut(auth);
    } else {
        authDiv.innerHTML = `
            <input id="email" type="email" placeholder="Email">
            <input id="password" type="password" placeholder="Password">
            <button id="loginBtn">შესვლა</button>
            <button id="regBtn">რეგისტრაცია</button>
        `;
        document.getElementById("loginBtn").onclick = () => {
            const e = document.getElementById("email").value;
            const p = document.getElementById("password").value;
            signInWithEmailAndPassword(auth, e, p).catch(err => alert(err.message));
        };
        document.getElementById("regBtn").onclick = () => {
            const e = document.getElementById("email").value;
            const p = document.getElementById("password").value;
            createUserWithEmailAndPassword(auth, e, p).catch(err => alert(err.message));
        };
    }
}

onAuthStateChanged(auth, updateUI);
