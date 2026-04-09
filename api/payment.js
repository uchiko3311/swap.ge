export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const auth = Buffer.from('4143977b-f886-4df9-a86e-1364f03a089f:386e277f-0932-4b5d-b109-7207191bb984').toString('base64');

  try {
    // 1. ავტორიზაცია - Token-ის აღება
    const tokenRes = await fetch('https://bog.ge', {
      method: 'POST',
      headers: { 
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });
    const { access_token } = await tokenRes.json();

    // 2. გადახდის ინიცირება
    const orderRes = await fetch('https://bog.ge', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: "2.00",
        currency: "GEL",
        callback_url: "https://swap.com.ge", // შენი საიტის მისამართი
        redirect_url: "https://swap.com.ge",
        language: "ka"
      })
    });
    const orderData = await orderRes.json();

    // ვაბრუნებთ ბანკის გადახდის ბმულს
    res.status(200).json({ url: orderData._links.checkout.href });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
