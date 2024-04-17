// import dotenv from 'dotenv'
// dotenv.config()

const getJSON = (target) =>
  new Promise((res) => {
    $.getJSON(target, function (jsonData) {
      res(jsonData);
    });
  });

const getMostFrequentElement = (array) => {
  if (_.isEmpty(array)) {
    return -1;
  }
  const ret = _.head(_.maxBy(_.entries(_.countBy(array)), _.last));
  if (!_.isEmpty(ret)) {
    // return _.toNumber(ret);
    return ret;
  }
  return -1;
};

mapboxgl.accessToken = "pk.eyJ1IjoiaW1hZGF2ZWxvcGVyIiwiYSI6ImNrZTdxZ3RiNjBydnYycXRmZm5vbzJnMm0ifQ.HvEjXY7eSD4PaQTL1Uhv6Q";

// var bounds = [
//   [-95.3566105298246, 13.0517966258875], // Southwest coordinates, ,
//   [-85.2111927824501, 18.416632999923] // Northeast coordinates,
// ];

const statusColorMap = new Map();
statusColorMap.set(1, "green"); // Passed
statusColorMap.set(0, "red"); // Failed
statusColorMap.set(2, "blue"); // Pending
const genderLanguageInclusiveColorMap = new Map();
genderLanguageInclusiveColorMap.set(2, "green"); // Yes
genderLanguageInclusiveColorMap.set(1, "red"); // No
genderLanguageInclusiveColorMap.set(3, "orange"); // TBD or TCRP-specific
const preventionEffortsMap = new Map();
preventionEffortsMap.set(2, "green"); // Yes
preventionEffortsMap.set(1, "red"); // No
preventionEffortsMap.set(3, "orange"); // TBD or TCRP-specific
const levelSurvivorInputColorMap =  new Map();
levelSurvivorInputColorMap.set(0,"red"); //No
levelSurvivorInputColorMap.set(1,"orange"); //Somewhat
levelSurvivorInputColorMap.set(2,"green"); //Yes
const mechanismsForEvaluationMap = new Map();
mechanismsForEvaluationMap.set(2, "green"); // Yes
mechanismsForEvaluationMap.set(1, "red"); // No
mechanismsForEvaluationMap.set(3, "orange"); // TBD or TCRP-specific
const indigenoudPopulationMap = new Map();
indigenoudPopulationMap.set()

var map = new mapboxgl.Map({
  container: "map", // container id
  style: "mapbox://styles/mapbox/streets-v11", // style URL
  // style: "mapbox://styles/mapbox/light-v10",
  center: [-96.4913263, 35.6634238], // starting position [lng, lat]
  zoom: 4,
  // maxBounds: bounds,
  //scrollZoom: false
});

map.addControl(
  new mapboxgl.NavigationControl({
    showCompass: false,
  }),
  "top-left"
);

map.addControl(
  new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: false,
    },
    // When active the map will receive updates to the device's location as it changes.
    trackUserLocation: false,
    // Draw an arrow next to the location dot to indicate which direction the device is heading.
    showUserHeading: true,
  }),
  "top-left"
);


  // Add a source for the state polygons.
//   map.addSource('states', {
//   'type': 'geojson',
//   'data': 'https://docs.mapbox.com/mapbox-gl-js/assets/ne_110m_admin_1_states_provinces_shp.geojson'
//   });



const layers = {
  status: {
    id: "status",
    layerName: "status-layer",
    propertyName: "status",
    buttonId: `status-btn`,
    colorMap: statusColorMap,
    policyTrackerNumeralColumnName: "Status",
    policyTrackerNumeralTextMap: ["Failed", "Passed", "Pending"],
  },
  genderInclusiveLanguage: {
    id: "genderInclusiveLanguage",
    layerName: "genderInclusiveLanguage-layer",
    propertyName: "genderInclusiveLanguage",
    buttonId: `genderInclusiveLanguage-btn`,
    colorMap: genderLanguageInclusiveColorMap,
    policyTrackerNumeralColumnName: "Gender Inclusive Language?",
    policyTrackerTextColumnName: "Gender Inclusive Language",
    policyTrackerNumeralTextMap: ["", "No", "Yes", "TBD or TCRP Specific"],
  },
  preventionEfforts: {
    id: "preventionEfforts",
    layerName: "preventionEfforts-layer",
    propertyName: "preventionEfforts",
    buttonId: `preventionEfforts-btn`,
    colorMap: preventionEffortsMap,
    policyTrackerNumeralColumnName: "Prevention Efforts?",
    policyTrackerTextColumnName: "Prevention Efforts",
    policyTrackerNumeralTextMap: ["", "No", "Yes", "TBD or TCRP Specific"],
  },
  mechanismsForEvaluation: {
    id: "mechanismsForEvaluation",
    layerName: "mechanismsForEvaluation-layer",
    propertyName: "mechanismsForEvaluation",
    buttonId: `mechanismsForEvaluation-btn`,
    colorMap: mechanismsForEvaluationMap,
    policyTrackerNumeralColumnName: "Mechanisms for Evaluation?",
    policyTrackerTextColumnName: "Mechanisms for Evaluation",
    policyTrackerNumeralTextMap: ["", "No", "Yes", "TBD or TCRP Specific"],
  },
  indigenousPopulation : {
    id: "indigenousPopulation",
    layerName: "indigenousPopulation-layer",
    propertyName: "population",
    buttonId: `indigenousPopulation-btn`,
    colorMap: mechanismsForEvaluationMap,
    pop_colname: "population",
    pct_colname: "population_pct",
  },
  indigenousPopulationPct : {
    id: "indigenousPopulationPct",
    layerName: "indigenousPopulationPct-layer",
    propertyName: "population_pct",
    buttonId: `indigenousPopulationPct-btn`,
    colorMap: mechanismsForEvaluationMap,
    pop_colname: "population",
    pct_colname: "population_pct",
  },
  levelSurvivorInput: {
    id: "levelSurvivorInput",
    layerName: "levelSurvivorInput-layer",
    propertyName: "levelSurvivorInput",
    buttonId: `levelSurvivorInput-btn`,
    colorMap: levelSurvivorInputColorMap,
    policyTrackerNumeralColumnName: "Level of Survivor \/ Relative Input",
    policyTrackerNumeralTextMap: ["No", "Somewhat", "Yes"],
  }
};

const getLegendHtml = (layer) => {
  const keys = _.chain(layer.colorMap.entries())
    .toArray()
    .map(([key]) => key)
    // .sortBy((key) => layer.stats[key])
    // .reverse()
    .value();

  // layers.forEach((layer, i) => {
  //   const color = colors[i];
  //   const item = document.createElement('div');
  //   const key = document.createElement('span');
  //   key.className = 'legend-key';
  //   key.style.backgroundColor = color;
  
  //   const value = document.createElement('span');
  //   value.innerHTML = `${layer}`;
  //   item.appendChild(key);
  //   item.appendChild(value);
  //   legend.appendChild(item);
  // });

  if(layer.id == "indigenousPopulationPct") {
      const ranges = [
        '<1%',
        '1 - 1.5%',
        '1.5% - 2.5%',
        '>2.5%',
      ]

      const colors = [
        '#feebe2',
        '#fbb4b9',
        '#f768a1',
        '#ae017e',
      ]

      const keys = [0,1,2,3]
      return `<div class="card"><div class="card-body"><div class="card-title">Population %
      </div>${_.map(
        keys,
        (key) => {
        const color = colors[key];
        const name = ranges[key];
        return `<div><span class="legend-key" style="background-color:${color};"></span><span style="color:${color}">${name}</span></div>`;
      }).join("\n")}</div></div>`;
  } else if(layer.id == "indigenousPopulation") {
    const ranges = [
      '<25,000',
      '25,000 - 50,000',
      '50,000 - 100,000',
      '>100,000'
    ]
    const keys = [0,1,2,3]
    const colors = [
      '#feebe2',
      '#fbb4b9',
      '#f768a1',
      '#ae017e'
    ]
    return `<div class="card"><div class="card-body"><div class="card-title">Population
    </div>${_.map(
      keys,
      (key) => {
      const color = colors[key];
      const name = ranges[key];
      return `<div><span class="legend-key" style="background-color:${color};"></span><span style="color:${color}">${name}</span></div>`;
    }).join("\n")}</div></div>`;
  } else {
    return `<div class="card"><div class="card-body"><div class="card-title">${
      layer.policyTrackerTextColumnName ?? layer.policyTrackerNumeralColumnName
    }</div><div style="display:flex"><div style="margin-right:6px;text-align:right;">${_.map(
      keys,
      (key) => {
        const count = layer.stats[key];
        return `<div><span style="margin-right:4px;">${count}</span>${
          count > 1 ? "states" : "state"
        }</div>`;
      }
    ).join("\n")}</div><div>${_.map(keys, (key) => {
      const color = layer.colorMap.get(key);
      const name = layer.policyTrackerNumeralTextMap[key];
      return `<div><span class="legend-key" style="background-color:${color};"></span><span style="color:${color}">${name}</span></div>`;
    }).join("\n")}</div></div></div></div>`;
  }
};

// $(function () {
//   $("#layer-legend").html(getLegendHtml(layers.status));
// });

const trimName = (name) => {
  const shortName = _.first(_.split(name, "  "));
  if (_.includes(name, "Bill Title:")) {
    const splitted = _.split(name, "Bill Title:");
    const title = _.trim(splitted[1], '" \\');
    return `${title} (${shortName})`;

  }
  if (_.includes(name, "Resolution Title:")) {
    const splitted = _.split(name, "Resolution Title:");
    const title = _.trim(splitted[1], '" \\');
    return `${title} (${shortName})`;
  }
  return shortName;
};

const createStatusPopoverHtml = (stateName, stateData) => {
  const layer = layers.status;
  const externalLinkIcon = `<i class="fas fa-external-link-alt" style="margin-left:4px;color:skyblue;"></i>`;
  const getStatusHtml = (statusName, statusColor) =>
    `<span style="margin-left:3px;color:${statusColor}">${
      statusName
        ? `<span>(${statusName})</span>`
        : "<span style='color:gray;'>(Not available)</span>"
    }</span>`;

  return `<div class="my-popover"><div class="popover-title">${stateName} has ${
    stateData.length
  } ${stateData.length > 1 ? "Policies" : "Policy"}</div><ul>${_.map(
    stateData,
    (it) => {
      const statusName =
          it[layer.policyTrackerNumeralColumnName];
      const statusColor = layer.colorMap.get(
        layer.policyTrackerNumeralTextMap.indexOf(it[layer.policyTrackerNumeralColumnName])
      );
      return `<li class="margin-bottom:4px;">${getNameHtml(
        it,
        externalLinkIcon
      )}${getStatusHtml(statusName, statusColor)}</li>`;
    }
  ).join("\n")}</ul></div>`;
};

const getNameHtml = (data, externalLinkIcon) =>
    _.isEmpty(data["Bill Overview (Link)"])
      ? `<span class="policy-name">${data["Bill Number"]}: ${trimName(data["Name"])}</span>`
      : `<a class="policy-name" href="${data["Bill Overview (Link)"]}" target="_blank" rel="noopener noreferrer">${data["Bill Number"]}: ${trimName(data["Name"])
    }${externalLinkIcon}</a>`;

const getShortDescriptionHtml = (layer, policyData) => {
    const color = layer.colorMap.get(
      layer.policyTrackerNumeralTextMap.indexOf(policyData[layer.policyTrackerNumeralColumnName])
    );
    return `<span>${
      layer.policyTrackerNumeralColumnName
    } <span style="color:${color}" class="policy-short-desc">${
        policyData[layer.policyTrackerNumeralColumnName]
    }</span></span>`;
  };

const createGenderInclusiveLanguagePopoverHtml = (
  layer,
  stateName,
  stateData
) => {
  const externalLinkIcon = `<i class="fas fa-external-link-alt" style="margin-left:4px;color:skyblue;"></i>`;
  const titleHtml = `<div class="popover-title">${stateName} ${layer.policyTrackerNumeralColumnName}</div>`;
  return `<div class="my-popover">${titleHtml}<ul>${_.map(stateData, (it) => {
    return `<li>${getNameHtml(it, externalLinkIcon)}
    <div>${getShortDescriptionHtml(layer,it)}</div>
    <div style="color:gray;margin-bottom:16px">${
      it[layer.policyTrackerTextColumnName]
    }</div></li>`;
  }).join("\n")}</ul></div>`;
};

const createPreventionEffortPopoverHtml = (layer, stateName, stateData) => {
  const externalLinkIcon = `<i class="fas fa-external-link-alt" style="margin-left:4px;color:skyblue;"></i>`;
  const titleHtml = `<div class="popover-title">${stateName} ${layer.policyTrackerNumeralColumnName}</div>`;
  return `<div class="my-popover">${titleHtml}<ul>${_.map(stateData, (it) => {
    return `<li>${getNameHtml(it, externalLinkIcon)}
    <div>${getShortDescriptionHtml(layer,it)}</div>
    <div style="color:gray;margin-bottom:16px">${
      it[layer.policyTrackerTextColumnName]
    }</div></li>`;
  }).join("\n")}</ul></div>`;
};
const createMechanismForEvaluationPopoverHtml = (layer, stateName, stateData) => {
  const externalLinkIcon = `<i class="fas fa-external-link-alt" style="margin-left:4px;color:skyblue;"></i>`;
  const titleHtml = `<div class="popover-title">${stateName} ${layer.policyTrackerNumeralColumnName}</div>`;
  return `<div class="my-popover">${titleHtml}<ul>${_.map(stateData, (it) => {
    return `<li>${getNameHtml(it, externalLinkIcon)}
    <div>${getShortDescriptionHtml(layer,it)}</div>
    <div style="color:gray;margin-bottom:16px">${
      it[layer.policyTrackerTextColumnName]
    }</div></li>`;
  }).join("\n")}</ul></div>`;
};
const createlevelSurvivorInputPopoverHtml = (layer, stateName, stateData) => {
  const externalLinkIcon = `<i class="fas fa-external-link-alt" style="margin-left:4px;color:skyblue;"></i>`;
  const titleHtml = `<div class="popover-title">${stateName} ${layer.policyTrackerNumeralColumnName}</div>`;
  return `<div class="my-popover">${titleHtml}<ul>${_.map(stateData, (it) => {
    return `<li>${getNameHtml(it, externalLinkIcon)}
    <div style="margin-bottom:16px">${getShortDescriptionHtml(layer,it)}</div>
    </li>`;
  }).join("\n")}</ul></div>`;
};
const createPopulationPopoverHtml = (stateName, population, population_pct) => {
  const layer = layers.indigenousPopulation;
  const titleHtml = `<div class="popover-title">${stateName}</div>`;
  return `<div class="my-popover">${titleHtml}<ul>\n
    <li>Population: ${numberWithCommas(population)}</li> \n
    <li>Population %: ${population_pct.toFixed(2)}%</li></ul></div>`;
};

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

map.on("load", async function () {
  // resetMap = document.getElementById("reset_button");
  // resetMap.addEventListener("click", function () {
  //   map.flyTo({ center: [-96.4913263, 35.6634238], zoom: 4 });
  // });

  const [policyTrackerData, states_geojson, population_data] = await Promise.all([
    // getJSON("policyTacker_2023.json"),
    getJSON("policyTracker_latest.json"),
    // $.ajax({
    //   url: 'https://api.airtable.com/v0/app0nHzjgm8HEKOCQ/Main',
    //   type: 'GET',
    //   dataType: 'json',
    //   // success: function() { alert('data fetch from airtable succeeded'); },
    //   error: function() { alert('data fetch from airtable failed'); },
    //   beforeSend: setHeader
    // }),
    getJSON(
      "https://docs.mapbox.com/mapbox-gl-js/assets/ne_110m_admin_1_states_provinces_shp.geojson"
    ),
    getJSON("census/population.geojson")
  ]);
  
  // const policyTrackerData = policyTrackerResponse.records.map(e => e.fields)
  console.log(policyTrackerData)
  const policyTrackerDataMapByState = _.groupBy(policyTrackerData, "State");
  // console.log(policyTrackerDataMapByState)
  const mergedData = _.map(states_geojson.features, (state, index) => {
    const shortName = state.properties.postal;
    const policies = policyTrackerDataMapByState[shortName];
    // console.log(shortName)
    // console.log(policies)
    // console.log(policies.length)
    const pop_vals = population_data.features.filter(o => o.properties.state_code == shortName)
    // debugger
    return {
      ...state,
      id: index,
      properties: {
        ...state.properties,
        [layers.status.propertyName]: _.isEmpty(policies)
          ? -1
          : layers.status.policyTrackerNumeralTextMap.indexOf(getMostFrequentElement(
              _.map(policies, layers.status.policyTrackerNumeralColumnName)
            )),
        [layers.genderInclusiveLanguage.propertyName]: _.isEmpty(policies)
          ? -1
          : layers.genderInclusiveLanguage.policyTrackerNumeralTextMap.indexOf(getMostFrequentElement(
              _.map(
                policies,
                layers.genderInclusiveLanguage.policyTrackerNumeralColumnName
              )
            )),
            [layers.levelSurvivorInput.propertyName]: _.isEmpty(policies)
          ? -1
          : layers.levelSurvivorInput.policyTrackerNumeralTextMap.indexOf(getMostFrequentElement(
              _.map(
                policies,
                layers.levelSurvivorInput.policyTrackerNumeralColumnName
              )
            )),
        [layers.preventionEfforts.propertyName]: _.isEmpty(policies)
          ? -1
          : layers.preventionEfforts.policyTrackerNumeralTextMap.indexOf(getMostFrequentElement(
              _.map(
                policies,
                layers.preventionEfforts.policyTrackerNumeralColumnName
              )
            )),
        [layers.mechanismsForEvaluation.propertyName]: _.isEmpty(policies)
          ? -1
          : layers.mechanismsForEvaluation.policyTrackerNumeralTextMap.indexOf(getMostFrequentElement(
              _.map(
                policies,
                layers.mechanismsForEvaluation.policyTrackerNumeralColumnName
              )
            )),
        policyCount: policies.length,
        population: pop_vals[0].properties.indigenous_population,
        population_pct: pop_vals[0].properties.indigenous_population_perentage *100,
      },
    };
  });
  console.log(mergedData)
  _.forEach(layers, (layer) => {
    const stats = _.countBy(
      mergedData,
      (state) => state.properties[layer.propertyName]
    );
    layer.stats = stats;
    console.log(layer)
  });


  // map.on('click', 'population', (e) => {
  //   new mapboxgl.Popup({closeButton: false})
  //   .setLngLat(e.lngLat)
  //   .setHTML(e.features[0].properties.state_code +': '+parseFloat(e.features[0].properties.indigenous_population_perentage).toFixed(4) + "% (total " + e.features[0].properties.indigenous_population + ")")
  //   .addTo(map);
  // });

  $("#layer-legend").html(getLegendHtml(layers.status));

  map.addSource("states", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: mergedData,
    },
  });

  const defaultLayer = layers.status.id;


  _.forEach(layers, (layer) => {
    // console.log("layer.layerName", layer.layerName);

    if(layer.id === "indigenousPopulationPct") {
      map.addLayer({
        'id': 'indigenousPopulationPct-layer',
        'type': 'fill',
        'source': 'states',
        'layout': { visibility: layer.id === defaultLayer ? "visible" : "none" },
        "paint": {
          "fill-color":{
            property: 'population_pct',
            stops: [[1, '#feebe2'], [1.5, '#fbb4b9'], [2.5, '#f768a1'], [20.0, '#ae017e']]
            },
          "fill-opacity": 0.75,
          "fill-outline-color": "black"
        }
      }) 
    } else if(layer.id === "indigenousPopulation"){
      map.addLayer({
        'id': 'indigenousPopulation-layer',
        'type': 'fill',
        'source': 'states',
        'layout': { visibility: layer.id === defaultLayer ? "visible" : "none" },
        "paint": {
          "fill-color":{
            property: 'population',
            stops: [[25000, '#feebe2'], [50000, '#fbb4b9'], [100000, '#f768a1'], [1000000, '#ae017e']]
            },
          "fill-opacity": 0.75,
          "fill-outline-color": "black"
        }
      }) 
    } else {
      map.addLayer({
        id: `${layer.layerName}`,
        type: "fill",
        source: "states",
        layout: { visibility: layer.id === defaultLayer ? "visible" : "none" },
        paint: {
          // "fill-color":'#193a45',
          "fill-color": [
            "case",
            ..._.chain(layer.colorMap.entries())
              .toArray()
              .map(([key, color]) => {
                return [["==", ["get", layer.propertyName], key], color];
              })
              .flatten()
              .value(),
            "transparent",
          ],
          "fill-opacity": 0.5,
          "fill-outline-color": "black",
        },
      });
    }

    $(`#${layer.buttonId}`).click(() => {
      $("#layer-legend").html(getLegendHtml(layer));
      _.forEach(layers, (l) => {
        if (l.id === layer.id) {
          map.setLayoutProperty(l.layerName, "visibility", "visible");
        } else {
          map.setLayoutProperty(l.layerName, "visibility", "none");
        }
      });
    });
  });
  (() => {
    const layer = layers.status;
    map.on("click", layer.layerName, (e) => {
      const feature = e.features[0];
      const state = feature.properties.postal;
      const stateData = policyTrackerDataMapByState[state];
      const stateName = feature.properties.name;
      new mapboxgl.Popup({ closeButton: false })
        .setLngLat(e.lngLat)
        .setHTML(createStatusPopoverHtml(stateName, stateData))
        .addTo(map);
    });
  })();
  (() => {
    const layer = layers.genderInclusiveLanguage;
    map.on("click", layer.layerName, (e) => {
      const feature = e.features[0];
      const state = feature.properties.postal;
      const stateData = policyTrackerDataMapByState[state];
      const stateName = feature.properties.name;

      new mapboxgl.Popup({ closeButton: false })
        .setLngLat(e.lngLat)
        .setHTML(
          createGenderInclusiveLanguagePopoverHtml(layer, stateName, stateData)
        )
        .addTo(map);
    });
  })();
  (() => {
    const layer = layers.preventionEfforts;
    map.on("click", layer.layerName, (e) => {
      const feature = e.features[0];
      const state = feature.properties.postal;
      const stateData = policyTrackerDataMapByState[state];
      const stateName = feature.properties.name;

      new mapboxgl.Popup({ closeButton: false })
        .setLngLat(e.lngLat)
        .setHTML(
          createPreventionEffortPopoverHtml(layer, stateName, stateData)
        )
        .addTo(map);
    });
  })();
  (() => {
    const layer = layers.mechanismsForEvaluation;
    map.on("click", layer.layerName, (e) => {
      const feature = e.features[0];
      const state = feature.properties.postal;
      const stateData = policyTrackerDataMapByState[state];
      const stateName = feature.properties.name;

      new mapboxgl.Popup({ closeButton: false })
        .setLngLat(e.lngLat)
        .setHTML(
          createMechanismForEvaluationPopoverHtml(layer, stateName, stateData)
        )
        .addTo(map);
    });
  })();
  (() => {
    const layer = layers.levelSurvivorInput;
    map.on("click", layer.layerName, (e) => {
      const feature = e.features[0];
      const state = feature.properties.postal;
      const stateData = policyTrackerDataMapByState[state];
      const stateName = feature.properties.name;

      new mapboxgl.Popup({ closeButton: false })
        .setLngLat(e.lngLat)
        .setHTML(
          createlevelSurvivorInputPopoverHtml(layer, stateName, stateData)
        )
        .addTo(map);
    });
  })();
  (() => {
    const layer = layers.indigenousPopulation;
    map.on("click", layer.layerName, (e) => {
      const feature = e.features[0];
      const state = feature.properties.postal;
      const population = feature.properties.population;
      const population_pct = feature.properties.population_pct;
      const stateName = feature.properties.name;

      new mapboxgl.Popup({ closeButton: false })
        .setLngLat(e.lngLat)
        .setHTML(
          createPopulationPopoverHtml(stateName, population, population_pct)
        )
        .addTo(map);
    });
  })();
  (() => {
    const layer = layers.indigenousPopulationPct;
    map.on("click", layer.layerName, (e) => {
      const feature = e.features[0];
      const state = feature.properties.postal;
      const population = feature.properties.population;
      const population_pct = feature.properties.population_pct;
      const stateName = feature.properties.name;
      // console.log(feature)

      new mapboxgl.Popup({ closeButton: false })
        .setLngLat(e.lngLat)
        .setHTML(
          createPopulationPopoverHtml(stateName, population, population_pct)
        )
        .addTo(map);
    });
  })();
});
