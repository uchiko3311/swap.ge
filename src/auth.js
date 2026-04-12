import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const authDiv = document.getElementById("auth");

authDiv.innerHTML = `
<input id="email" placeholder="Email">
<input id="password" type="password" placeholder="Password">
<button onclick="login()">Login</button>
<button onclick="register()">Register</button>
<button onclick="logout()">Logout</button>
`;

window.login = async () => {
  await signInWithEmailAndPassword(
    auth,
    email.value,
    password.value
  );
  alert("Logged in");
};

window.register = async () => {
  await createUserWithEmailAndPassword(
    auth,
    email.value,
    password.value
  );
  alert("Registered");
};

window.logout = async () => {
  await signOut(auth);
  alert("Logged out");
};
