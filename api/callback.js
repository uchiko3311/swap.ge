import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import admin from "firebase-admin";

// Firebase Admin-ის ინიციალიზაცია (Vercel-ზე გამოსაყენებლად)
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: "swap-39e13",
            clientEmail: "შენი-service-account-email", // Firebase Settings-დან აიღე
            privateKey: "შენი-private-key".replace(/\\n/g, '\n'),
        })
    });
}

const db = getFirestore();

export default async function handler(req, res) {
    // ბანკი პოსტ მოთხოვნას აგზავნის გადახდის სტატუსით
    if (req.method !== 'POST') return res.status(405).end();

    const { status, external_id } = req.body;

    try {
        // თუ გადახდა წარმატებულია ('success' ან 'completed' ბანკის მიხედვით)
        if (status === 'completed' || status === 'success') {
            const userRef = db.collection('users').doc(external_id);
            
            // მომხმარებლისთვის VIP სტატუსის მინიჭება ბაზაში
            await userRef.set({
                isVIP: true,
                vipActivatedAt: new Date().toISOString()
            }, { merge: true });

            console.log(`VIP სტატუსი გააქტიურდა მომხმარებლისთვის: ${external_id}`);
            return res.status(200).send("OK");
        }

        res.status(400).send("Payment not successful");
    } catch (error) {
        console.error("Callback Error:", error);
        res.status(500).json({ error: error.message });
    }
}
