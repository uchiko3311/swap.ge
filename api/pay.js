export default async function handler(req, res) {
  const clientId = '4143977b-f886-4df9-a86e-1364f03a089f';
  const secret = '386e277f-0932-4b5d-b109-7207191bb984';

  try {
    // 1. ავტორიზაცია
    const authResponse = await fetch('https://bog.ge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(clientId + ':' + secret).toString('base64')
      },
      body: 'grant_type=client_credentials'
    });

    const authText = await authResponse.text(); // ვკითხულობთ როგორც ტექსტს, რომ შეცდომა დავიჭიროთ
    let authData;
    
    try {
        authData = JSON.parse(authText);
    } catch (e) {
        return res.status(500).json({ error: "ბანკის ავტორიზაციის შეცდომა", rawResponse: authText });
    }

    if (!authData.access_token) {
        return res.status(401).json({ error: "Access Token ვერ მივიღეთ", details: authData });
    }

    // 2. გადახდის შექმნა
    const orderResponse = await fetch('https://bog.ge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authData.access_token}`,
        'Accept-Language': 'ka'
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        items: [{
          name: 'Premium Package',
          amount: '2.00',
          quantity: 1
        }],
        redirect_url: 'https://swap.com.ge',
        currency: 'GEL'
      })
    });

    const orderData = await orderResponse.json();

    if (orderData._links && orderData._links.checkout) {
      res.redirect(orderData._links.checkout.href);
    } else {
      res.status(400).json({ error: "ბანკმა გადახდა არ დაარეეგისტრირა", details: orderData });
    }

  } catch (error) {
    res.status(500).json({ error: "სერვერის შეცდომა", message: error.message });
  }
}
