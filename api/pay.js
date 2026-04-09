export default async function handler(req, res) {
  const clientId = '4143977b-f886-4df9-a86e-1364f03a089f';
  const secret = '386e277f-0932-4b5d-b109-7207191bb984';

  try {
    // 1. ავტორიზაცია (Token-ის მიღება)
    const authResponse = await fetch('https://bog.ge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(clientId + ':' + secret).toString('base64')
      },
      body: 'grant_type=client_credentials'
    });

    const authData = await authResponse.json();
    
    if (!authData.access_token) {
        return res.status(401).json({ error: "ავტორიზაციის შეცდომა ბანკთან", details: authData });
    }

    const token = authData.access_token;

    // 2. გადახდის შეკვეთა
    const orderResponse = await fetch('https://bog.ge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
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
      res.status(400).json({ error: "ბანკმა გადახდის ბმული არ მოგვცა", details: orderData });
    }

  } catch (error) {
    res.status(500).json({ error: "სერვერის შეცდომა", message: error.message });
  }
}
