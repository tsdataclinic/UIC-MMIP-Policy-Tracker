// import dotenv from 'dotenv'
// dotenv.config()

mapboxgl.accessToken = 'pk.eyJ1IjoiaW1hZGF2ZWxvcGVyIiwiYSI6ImNrZTdxZ3RiNjBydnYycXRmZm5vbzJnMm0ifQ.HvEjXY7eSD4PaQTL1Uhv6Q';

// var bounds = [
//   [-95.3566105298246, 13.0517966258875], // Southwest coordinates, , 
//   [-85.2111927824501, 18.416632999923] // Northeast coordinates, 
// ];
$.getJSON("data/us_states.geojson", function(jsonData) { 
  states_geojson = jsonData
  console.log(states_geojson)
});

var map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/streets-v11', // style URL
  center: [-96.4913263,35.6634238], // starting position [lng, lat]
  zoom: 4,
  // maxBounds: bounds,
  //scrollZoom: false
});

map.addControl(new mapboxgl.NavigationControl({
  showCompass: false
}),'top-left');

map.on('load', function() {

  // Add a source for the state polygons.
  map.addSource('states', {
  'type': 'geojson',
  'data': 'https://docs.mapbox.com/mapbox-gl-js/assets/ne_110m_admin_1_states_provinces_shp.geojson'
  });
  
  resetMap = document.getElementById('reset_button')
  resetMap.addEventListener('click', function(){
    map.flyTo({center: [-96.4913263,35.6634238], zoom:4});
  })

  map.addLayer({
    'id': 'states-layer',
    'type': 'fill',
    'source': 'states',
    'layout':{"visibility": 'visible'},
    "paint": {
      "fill-color":'#193a45',
      "fill-opacity": 0.1,
      "fill-outline-color": "black"
  }
  });

  map.on('click', 'states-layer', (e) => {
    new mapboxgl.Popup({closeButton: false})
    .setLngLat(e.lngLat)
    .setHTML(e.features[0].properties.name)
    .addTo(map);
    });

});



