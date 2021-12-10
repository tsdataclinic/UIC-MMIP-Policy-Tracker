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
    return _.toNumber(ret);
  }
  return -1;
};

mapboxgl.accessToken =
  "pk.eyJ1IjoiaW1hZGF2ZWxvcGVyIiwiYSI6ImNrZTdxZ3RiNjBydnYycXRmZm5vbzJnMm0ifQ.HvEjXY7eSD4PaQTL1Uhv6Q";

// var bounds = [
//   [-95.3566105298246, 13.0517966258875], // Southwest coordinates, ,
//   [-85.2111927824501, 18.416632999923] // Northeast coordinates,
// ];

const statusColorMap = new Map();
statusColorMap.set(1, "green"); // Passed
statusColorMap.set(0, "red"); // Failed to pass
statusColorMap.set(2, "blue"); // Pending
const genderLanguageInclusiveColorMap = new Map();
genderLanguageInclusiveColorMap.set(2, "green"); // Yes
genderLanguageInclusiveColorMap.set(1, "red"); // No
genderLanguageInclusiveColorMap.set(3, "orange"); // TBD or TCRP-specific
const preventionEffortsMap = new Map();
preventionEffortsMap.set(2, "green"); // Yes
preventionEffortsMap.set(1, "red"); // No
preventionEffortsMap.set(3, "orange"); // TBD or TCRP-specific
const mechanismsForEvaluationMap = new Map();
mechanismsForEvaluationMap.set(2, "green"); // Yes
mechanismsForEvaluationMap.set(1, "red"); // No
mechanismsForEvaluationMap.set(3, "orange"); // TBD or TCRP-specific

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

const layers = {
  status: {
    id: "status",
    layerName: "status-layer",
    propertyName: "status",
    buttonId: `status-btn`,
    colorMap: statusColorMap,
    policyTrackerNumeralColumnName: "Status",
    policyTrackerNumeralTextMap: ["Failed to pass", "Passed", "Pending"],
  },
  genderInclusiveLanguage: {
    id: "genderInclusiveLanguage",
    layerName: "genderInclusiveLanguage-layer",
    propertyName: "genderInclusiveLanguage",
    buttonId: `genderInclusiveLanguage-btn`,
    colorMap: genderLanguageInclusiveColorMap,
    policyTrackerNumeralColumnName: "Gender Inclusive Language?",
    policyTrackerTextColumnName: "Gender Inclusive Language",
    policyTrackerNumeralTextMap: ["", "No", "Yes", "TBD or TCRP-specific"],
  },
  preventionEfforts: {
    id: "preventionEfforts",
    layerName: "preventionEfforts-layer",
    propertyName: "preventionEfforts",
    buttonId: `preventionEfforts-btn`,
    colorMap: preventionEffortsMap,
    policyTrackerNumeralColumnName: "Prevention Efforts?",
    policyTrackerTextColumnName: "Prevention Efforts",
    policyTrackerNumeralTextMap: ["", "No", "Yes", "TBD or TCRP-specific"],
  },
  mechanismsForEvaluation: {
    id: "mechanismsForEvaluation",
    layerName: "mechanismsForEvaluation-layer",
    propertyName: "mechanismsForEvaluation",
    buttonId: `mechanismsForEvaluation-btn`,
    colorMap: mechanismsForEvaluationMap,
    policyTrackerNumeralColumnName: "Mechanisms for Evaluation?",
    policyTrackerTextColumnName: "Mechanisms for Evaluation",
    policyTrackerNumeralTextMap: ["", "No", "Yes", "TBD or TCRP-specific"],
  },
};

const getLegendHtml = (layer) => {
  const keys = _.chain(layer.colorMap.entries())
    .toArray()
    .map(([key]) => key)
    // .sortBy((key) => layer.stats[key])
    // .reverse()
    .value();

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
  const getNameHtml = (link, name) =>
    _.isEmpty(link)
      ? `<span>${trimName(name)}</span>`
      : `<a href="${link}" target="_blank" rel="noopener noreferrer">${trimName(
          name
        )}${externalLinkIcon}</a>`;
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
        layer.policyTrackerNumeralTextMap[
          it[layer.policyTrackerNumeralColumnName]
        ];
      const statusColor = layer.colorMap.get(
        it[layer.policyTrackerNumeralColumnName]
      );
      return `<li class="margin-bottom:4px;">${getNameHtml(
        it["Link 1"],
        it.Name
      )}${getStatusHtml(statusName, statusColor)}</li>`;
    }
  ).join("\n")}</ul></div>`;
};

const createGenderInclusiveLanguagePopoverHtml = (
  layer,
  stateName,
  stateData
) => {
  const externalLinkIcon = `<i class="fas fa-external-link-alt" style="margin-left:4px;color:skyblue;"></i>`;
  const titleHtml = `<div class="popover-title">[${stateName}] ${layer.policyTrackerNumeralColumnName}</div>`;
  const getNameHtml = (link, name) =>
    _.isEmpty(link)
      ? `<span class="policy-name">${trimName(name)}</span>`
      : `<a class="policy-name" href="${link}" target="_blank" rel="noopener noreferrer">${trimName(
          name
        )}${externalLinkIcon}</a>`;
  const getShortDescriptionHtml = (policyData) => {
    const color = layer.colorMap.get(
      policyData[layer.policyTrackerNumeralColumnName]
    );
    return `<span>${
      layer.policyTrackerNumeralColumnName
    } <span style="color:${color}" class="policy-short-desc">${
      layer.policyTrackerNumeralTextMap[
        policyData[layer.policyTrackerNumeralColumnName]
      ]
    }</span></span>`;
  };
  return `<div class="my-popover">${titleHtml}<ul>${_.map(stateData, (it) => {
    return `<li>${getNameHtml(it["Link 1"], it.Name)}
    <div>${getShortDescriptionHtml(it)}</div>
    <div style="color:gray;margin-bottom:16px">${
      it[layer.policyTrackerTextColumnName]
    }</div></li>`;
  }).join("\n")}</ul></div>`;
};
const createPreventionEffortPopoverHtml = (stateName, stateData) => {
  const layer = layers.preventionEfforts;
  return `<ul>${_.map(stateData, (it) => {
    return `<li><span style="color:${(() => {
      return layer.colorMap.get(it[layer.policyTrackerNumeralColumnName]);
    })()}">(${layer.policyTrackerNumeralColumnName}: ${
      layer.policyTrackerNumeralTextMap[
        it[layer.policyTrackerNumeralColumnName]
      ]
    })</span> <a href="${
      it["Link 1"]
    }" target="_blank" rel="noopener noreferrer">${trimName(
      it.Name
    )}</a><div style="color:red">${
      it[layer.policyTrackerTextColumnName]
    }</div></li>`;
  }).join("\n")}</ul>`;
};
const createMechanismForEvaluationPopoverHtml = (stateName, stateData) => {
  const layer = layers.mechanismsForEvaluation;
  return `<ul>${_.map(stateData, (it) => {
    return `<li><span style="color:${(() => {
      return layer.colorMap.get(it[layer.policyTrackerNumeralColumnName]);
    })()}">(${layer.policyTrackerNumeralColumnName}: ${
      layer.policyTrackerNumeralTextMap[
        it[layer.policyTrackerNumeralColumnName]
      ]
    })</span> <a href="${
      it["Link 1"]
    }" target="_blank" rel="noopener noreferrer">${trimName(
      it.Name
    )}</a><div style="color:red">${
      it[layer.policyTrackerTextColumnName]
    }</div></li>`;
  }).join("\n")}</ul>`;
};

map.on("load", async function () {
  // resetMap = document.getElementById("reset_button");
  // resetMap.addEventListener("click", function () {
  //   map.flyTo({ center: [-96.4913263, 35.6634238], zoom: 4 });
  // });

  const [policyTrackerData, states_geojson] = await Promise.all([
    getJSON("policyTrackerDec2021.json"),
    getJSON(
      "https://docs.mapbox.com/mapbox-gl-js/assets/ne_110m_admin_1_states_provinces_shp.geojson"
    ),
  ]);
  const policyTrackerDataMapByState = _.groupBy(policyTrackerData, "State");

  const mergedData = _.map(states_geojson.features, (state, index) => {
    const shortName = state.properties.postal;
    const policies = policyTrackerDataMapByState[shortName];
    return {
      ...state,
      id: index,
      properties: {
        ...state.properties,
        [layers.status.propertyName]: _.isEmpty(policies)
          ? -1
          : getMostFrequentElement(
              _.map(policies, layers.status.policyTrackerNumeralColumnName)
            ),
        [layers.genderInclusiveLanguage.propertyName]: _.isEmpty(policies)
          ? -1
          : getMostFrequentElement(
              _.map(
                policies,
                layers.genderInclusiveLanguage.policyTrackerNumeralColumnName
              )
            ),
        [layers.preventionEfforts.propertyName]: _.isEmpty(policies)
          ? -1
          : getMostFrequentElement(
              _.map(
                policies,
                layers.preventionEfforts.policyTrackerNumeralColumnName
              )
            ),
        [layers.mechanismsForEvaluation.propertyName]: _.isEmpty(policies)
          ? -1
          : getMostFrequentElement(
              _.map(
                policies,
                layers.mechanismsForEvaluation.policyTrackerNumeralColumnName
              )
            ),
        policyCount: policies.length,
      },
    };
  });
  _.forEach(layers, (layer) => {
    const stats = _.countBy(
      mergedData,
      (state) => state.properties[layer.propertyName]
    );
    layer.stats = stats;
  });

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
          createGenderInclusiveLanguagePopoverHtml(layer, stateName, stateData)
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
          createGenderInclusiveLanguagePopoverHtml(layer, stateName, stateData)
        )
        .addTo(map);
    });
  })();
});
