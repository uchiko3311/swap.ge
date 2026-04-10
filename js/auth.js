import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://gstatic.com";
import { doc, setDoc } from "https://gstatic.com";

// რეგისტრაცია (ავტომატურად ვანიჭებთ 1 უფასო პოსტს)
export async function registerUser(email, password) {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", res.user.uid), {
        email: email,
        isVip: false,
        postLimit: 1, // 1 უფასო განცხადება
        createdAt: new Date()
    });
}
