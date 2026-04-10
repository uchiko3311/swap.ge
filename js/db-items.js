import { db } from './firebase-config.js';
import { collection, addDoc, getDocs, query, where } from "https://gstatic.com";

// განცხადების დამატება (30 დღიანი ვადით)
export async function addItem(userId, itemData) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    return await addDoc(collection(db, "items"), {
        ...itemData,
        ownerId: userId,
        createdAt: new Date(),
        expiresAt: expiryDate,
        status: "active"
    });
}
