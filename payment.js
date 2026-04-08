async function vipPayment(){
  const res = await fetch('https://your-server.com/api/payment/create-payment',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({userId:'123',amount:4.99})
  });
  const data = await res.json();
  window.open(data.paymentUrl,'_blank');
}
