function changeTab(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// Google Map
function initMap(){
  const map = new google.maps.Map(document.getElementById('map'),{
    center:{lat:41.7151,lng:44.8271},
    zoom:7
  });
}
