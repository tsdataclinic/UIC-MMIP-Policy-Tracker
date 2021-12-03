// import dotenv from 'dotenv'
// dotenv.config()

mapboxgl.accessToken = 'pk.eyJ1IjoiaW1hZGF2ZWxvcGVyIiwiYSI6ImNrZTdxZ3RiNjBydnYycXRmZm5vbzJnMm0ifQ.HvEjXY7eSD4PaQTL1Uhv6Q';

// var bounds = [
//   [-95.3566105298246, 13.0517966258875], // Southwest coordinates, , 
//   [-85.2111927824501, 18.416632999923] // Northeast coordinates, 
// ];

var map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/streets-v11', // style URL
  center: [-104.6597064,37.275387], // starting position [lng, lat]
  zoom: 3,
  // maxBounds: bounds,
  //scrollZoom: false
});

map.addControl(new mapboxgl.NavigationControl({
  showCompass: false
}),'top-left');

map.on('load', function() {

  map.addSource('usmap', {
    type: 'geojson',
    data: states_geojson
  });
  
  resetMap = document.getElementById('reset_button')
  resetMap.addEventListener('click', function(){
    map.flyTo({center: [-104.6597064,37.275387], zoom:3});
  })

});



