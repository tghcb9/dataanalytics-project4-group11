function createMap() {
  // Step 1: CREATE THE BASE LAYERS
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Assemble the API query URL for map data
  let url = "/api/v1.0/map_data";
  console.log(url);

  d3.json(url).then(function (data) {
    // Step 2: CREATE THE DATA/OVERLAY LAYERS
    console.log(data);

    // Initialize the Cluster Group
    let heatArray = [];
    let markers = L.markerClusterGroup();

    // Loop and create markers
    for (let i = 0; i < data.length; i++) {
      let row = data[i];

      let marker = L.circleMarker([row.latitude, row.longitude], {
        radius: 10, // Size of the circle
        color: "#006241", // Outline color
        fillColor: "#D3D3D3", // Fill color
        fillOpacity: 0.8, // Transparency
        weight: 6 // Border thickness
      }).bindPopup(`<h1>${row.store_number}<h1><h2>${row.city}, ${row.country}</h2><h3>${row.region}</h3>`);
      markers.addLayer(marker);

      // Heatmap point
      heatArray.push([row.latitude, row.longitude]);
    }

    // Create Heatmap Layer
    let heatLayer = L.heatLayer(heatArray, {
      radius: 22,  // Increase the radius to make heat spots larger
      blur: 35,    // Decrease blur to sharpen heatmap
      maxZoom: 5, // Allow the heatmap to be more detailed at higher zoom levels
      max: 0.4,    // Adjust the intensity of the heat points (0.0 to 1.0)
      gradient: {  // Custom color gradient for better vibrancy
          0.2: "blue",
          0.4: "cyan",
          0.6: "lime",
          0.8: "yellow",
          1.0: "red"
      }
    });
  

    // Step 3: CREATE THE LAYER CONTROL
    let baseMaps = {
      Street: street,
      Topography: topo
    };

    let overlayMaps = {
      HeatMap: heatLayer,
      Stores: markers
    };

    // Step 4: INITIALIZE THE MAP
    let myMap = L.map("map_container", {
      center: [39.82830, -98.57950],
      zoom: 4,
      layers: [street, markers]
    });

    // Step 5: Add the Layer Control
    L.control.layers(baseMaps, overlayMaps, heatLayer).addTo(myMap);
  });
}

function init() {
  createMap();
}
  
  // on page load
  init();
  