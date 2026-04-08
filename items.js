async function addItem(){
  const title = prompt("დასახელება:");
  if(!title) return;
  const lat = 41.7151;
  const lng = 44.8271;
  await db.collection('items').add({title,lat,lng,createdAt:Date.now()});
  alert("ნივთი დაემატა!");
  loadItems();
  notifyUser(`ნივთი "${title}" დაემატა!`);
}

async function loadItems(){
  const itemsList = document.getElementById('itemsList');
  itemsList.innerHTML='';
  const snapshot = await db.collection('items').orderBy('createdAt','desc').get();
  snapshot.forEach(doc=>{
    const data = doc.data();
    itemsList.innerHTML+=`<div class="card">${data.title}</div>`;
  });
}
loadItems();
