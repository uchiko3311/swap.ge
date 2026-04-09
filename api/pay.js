// api/pay.js
export default async function handler(req, res) {
  const clientId = '4143977b-f886-4df9-a86e-1364f03a089f';
  const secret = '386e277f-0932-4b5d-b109-7207191bb984';

  // 1. ავტორიზაცია ბანკთან (Token-ის აღება)
  const authRequest = await fetch('https://bog.ge', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(clientId + ':' + secret).toString('base64')
    },
    body: 'grant_type=client_credentials'
  });

  const authData = await authRequest.json();
  const token = authData.access_token;

  // 2. გადახდის შეკვეთის შექმნა (2 ლარი)
  const orderRequest = await fetch('https://bog.ge', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      items: [{ name: 'Premium Package', amount: '2.00', quantity: 1 }],
      redirect_url: 'https://swap.com.ge',
      currency: 'GEL'
    })
  });

  const orderData = await orderRequest.json();
  
  // მომხმარებლის გადამისამართება ბანკის გვერდზე
  res.redirect(orderData._links.checkout.href);
}
