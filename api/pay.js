export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const clientID = '4143977b-f886-4df9-a86e-1364f03a089f';
    const secretKey = '386e277f-0932-4b5d-b109-7207191bb984';

    try {
        // 1. ავტორიზაცია ბანკთან (Token-ის აღება)
        const authResponse = await fetch('https://bog.ge', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(clientID + ':' + secretKey)
            },
            body: 'grant_type=client_credentials'
        });
        const authData = await authResponse.json();
        const token = authData.access_token;

        // 2. გადახდის შეკვეთის შექმნა (2 ლარი)
        const orderResponse = await fetch('https://bog.ge', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                amount: 2.00,
                currency: 'GEL',
                callback_url: 'https://swap.com.ge', // ბანკი აქ გამოგვიგზავნის დასტურს
                external_id: 'order_' + Date.now(),
                intent: 'CAPTURE'
            })
        });

        const orderData = await orderResponse.json();
        
        // ვუბრუნებთ მომხმარებელს გადახდის ლინკს
        res.status(200).json({ url: orderData._links.checkout.href });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
