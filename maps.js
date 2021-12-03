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
let policyTrackerData = {};
$.getJSON("policyTrackerDec2021.json", (data) => {
 console.log("data", data);
  policyTrackerData = data;
 const AK = _.filter(data, {State: 'AK'})
  console.log("AK", AK);
})

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
  // 'data': 'https://docs.mapbox.com/mapbox-gl-js/assets/ne_110m_admin_1_states_provinces_shp.geojson'
  //   'data': 'https://docs.mapbox.com/mapbox-gl-js/assets/us_states.geojson'
    'data': 'data/us_states2.geojson'
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
      // "fill-color":'#193a45',
      "fill-color": [
        'case',
        ['==', ['feature-state', 'status'], 0],
        'purple',
        ['==', ['feature-state', 'status'], 1],
        'green',
        ['==', ['feature-state', 'status'], 2],
        'orange',
        ['==', ['feature-state', 'status'], 4],
        'blue',
       'pink'
          ],

          "fill-opacity": 0.5,
      "fill-outline-color": "black"
  }
  });

  map.on('click', 'states-layer', (e) => {
;

    // console.log(map)
    // console.log('states-layer', map.getLayer('states-layer'))
    const ret =map.querySourceFeatures('states');
    console.log("ret", ret);
    console.log("policyTrackerData", policyTrackerData);
    _.forEach(ret, feature =>{
      // console.log("feature", feature.properties);
      const state = feature.properties.State;
      console.log("state", state);
      const stateData = _.filter(policyTrackerData, {State: state})
      console.log("stateData", stateData  );
      const finalStatus = _.isEmpty(stateData) ? 4 : stateData[0].Status
      console.log("stateData[0]", stateData[0]);
      console.log("finalStatus", finalStatus);
      map.setFeatureState({source: 'states', id: feature.id, }, {status: finalStatus})
    })
    const feature = e.features[0];
    const state = feature.properties.State;
    const stateData = _.filter(policyTrackerData, {State: state})

    new mapboxgl.Popup({closeButton: false})
      .setLngLat(e.lngLat)
      .setHTML(`<ul>${_.map(stateData, it => {
        return `<li><span style="color:${(() => {
          switch (it.Status) {
            case 0: {return 'purple'}
            case 1: {return 'green'}
            case 2: {return 'orange'}
            case 3: {return 'blue'}
          }
        })()}">(Status: ${it.Status})</span> <a href="${it['Link 1']}">${it.Name}</a></li>`
      })}</ul>`)
      .addTo(map)

    // console.log("e", e);
    // console.log("e", e.features);
    // _.forEach(e.features, feature => {
    //   console.log("feature", feature.id, feature);
    //   map.setFeatureState({source: 'states', id: feature.id, }, {status: 2})
    // })
  });

});



