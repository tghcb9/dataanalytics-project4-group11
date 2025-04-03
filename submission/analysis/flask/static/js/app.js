// Use D3 to select the table
let table = d3.select("#stores_table");
let tbody = table.select("tbody");

// Make Table Interactive
let dt_table = new DataTable('#stores_table');

// Event Listener for Filter Button
d3.select("#filter-btn").on("click", function () {
  // event.preventDefault(); // Prevent form submission refresh

  let country_input = d3.select("#country-input").property("value").trim();

  if (!country_input) {
    alert("Please enter a country!");
    return;
  }

  let url1 = `/api/v1.0/bar_data/${country_input}`;

  d3.json(url1).then(function (data) {
    makeBarPlot(data, country_input);
  });
});

// Prevent form submission refresh
d3.select("#filter-form").on("submit", function(event) {
  event.preventDefault(); // Stop page reload
  doWork(); // Run function
});


// On Page Load
window.onload = function () {
  // Set default country input to "US"
  d3.select("#country-input").property("value", "United States");
  doWork(); // Call function on load
};

function doWork() {
  // Fetch the table and sunburst data on load
  let url2 = `/api/v1.0/table_data`;
  let url3 = `/api/v1.0/burst_data`;

  d3.json(url2).then(function (data) {
      makeTable(data);
  });

  d3.json(url3).then(function (data) {
      makeSunBurst(data);
  });

  // Fetch the bar chart data only if a country is entered
  let country_input = d3.select("#country-input").property("value").trim();

  if (country_input) {
      let url1 = `/api/v1.0/bar_data/${country_input}`;

      d3.json(url1).then(function (data) {
          makeBarPlot(data, country_input);
      });
  }
}

function makeTable(data) {
  tbody.html("");
  dt_table.clear().destroy();
  for (let row of data) {
    let table_row = tbody.append("tr");
    table_row.append("td").text(row.store_number).style("background-color", "#FFF8E1").style("color", "#3E2723");
    table_row.append("td").text(row.country).style("background-color", "#FFF8E1").style("color", "#3E2723");
    table_row.append("td").text(row.city).style("background-color", "#FFF8E1").style("color", "#3E2723");
    table_row.append("td").text(row.state_province).style("background-color", "#FFF8E1").style("color", "#3E2723");
    table_row.append("td").text(row.latitude).style("background-color", "#FFF8E1").style("color", "#3E2723");
    table_row.append("td").text(row.longitude).style("background-color", "#FFF8E1").style("color", "#3E2723");
  }
  dt_table = new DataTable('#stores_table', { order: [[0, 'desc']] });
}


function makeBarPlot(data, country) {
  if (data.length === 0) {
    alert("No data available for the selected country.");
    return;
  }
  data.sort((a, b) => b.store_count - a.store_count);
  let colors = ['#006241', '#8B5A2B'];
  let trace = {
    x: data.map(row => row.state_province),
    y: data.map(row => row.store_count),
    type: 'bar',
    marker: {
      color: data.map((_, i) => colors[i % colors.length]),
      opacity: 0.85,
    },
  };
  let layout = {
    title: {
      text: `Number of Starbucks Stores in ${country}`,
      font: {
        size: 24,
        color: "#3D2B1F",
        family: "Arial Black, sans-serif"
      }
    },
    yaxis: {
      title: { text: 'Number of Stores' },
      gridcolor: "#EDE0C8",
    },
    xaxis: {
      title: { text: 'State/Province' },
      tickangle: -45,
    },
    height: 500,
    width: 880,
    paper_bgcolor: "#F3E5AB",
    plot_bgcolor: "#EDE0C8",
    margin: { l: 60, r: 20, t: 50, b: 100 },
    font: { color: "#3D2B1F", family: "Verdana, sans-serif" }
  };
  Plotly.newPlot('plot', [trace], layout);
}


function makeSunBurst(data) {
  // Dictionaries to store aggregated values
  let regionValues = {};
  let countryValues = {};
  let countryLabelMap = {}; // Maps full country label to short country code

  let labels = [];
  let parents = [];
  let values = [];
  let ids = [];
  let colorMapping = {}; // Stores custom colors


  data.forEach(row => {
    let { region, country, state_province, store_count } = row;

    // Create a mapping to use the country code instead of "Region-Country"
    let id = `${state_province}-${country}-${region}`;
    let parent = `${country}-${region}`;
    let countryLabel = `${region}-${country}`; // Internal tracking
    let displayCountryLabel = country; // Display-only (e.g., "GB" instead of "Europe-GB")

    // Remove country prefix from state/province
    let uniqueStateLabel = state_province; // Just state/province name, no country prefix

    // Sum store counts at the country level
    if (!countryValues[countryLabel]) {
      countryValues[countryLabel] = 0;
      countryLabelMap[countryLabel] = displayCountryLabel; // Store display name
    }
    countryValues[countryLabel] += store_count;

    // Sum store counts at the region level
    if (!regionValues[region]) {
      regionValues[region] = 0;
    }
    regionValues[region] += store_count;

    // Add state/province level data
    labels.push(uniqueStateLabel);
    parents.push(parent);
    values.push(store_count);
    ids.push(id);
  });

  // **Define Region Colors**
  let regionColors = {
    "Americas": "#006241", // Starbucks Green
    "Europe": "#D4A276", // Latte Beige
    "Asia": "#8B5A2B", // Espresso Brown
    "Africa": "#EDE0C8", // Light Cream
    "Oceania": "#3D2B1F"  // Dark Coffee
  };

  // Function to generate a lighter shade of a given hex color
  function lightenColor(hex, percent) {
    let num = parseInt(hex.slice(1), 16);
    let amt = Math.round(2.55 * percent);
    let r = (num >> 16) + amt;
    let g = ((num >> 8) & 0x00FF) + amt;
    let b = (num & 0x0000FF) + amt;
    
    return `rgb(${Math.min(r, 255)}, ${Math.min(g, 255)}, ${Math.min(b, 255)})`;
  }

  // Add country-level nodes (Countries inherit the region color)
  Object.keys(countryValues).forEach(countryLabel => {
    let displayCountryLabel = countryLabelMap[countryLabel]; // Extract country code (e.g., "GB")
    let region = countryLabel.split("-")[0]; // Extract region
    let id = `${displayCountryLabel}-${region}`;
    let parent = `${region}`;

    labels.push(displayCountryLabel);
    parents.push(parent);
    values.push(countryValues[countryLabel]);
    ids.push(id);

    // Assign the region color to the country
    let countryColor = regionColors[region] || "#AAAAAA"; 
    colorMapping[displayCountryLabel] = countryColor;
  });

  // Add region-level nodes with aggregated values
  Object.keys(regionValues).forEach(region => {
    labels.push(region);
    parents.push(""); // Root node
    values.push(regionValues[region]);
    ids.push(region);


    // Assign region colors
    colorMapping[region] = regionColors[region] || "#777777";
  });


  // Assign lighter shades for states/provinces
  labels.forEach(label => {
    if (!regionValues[label] && !countryValues[label]) { // Only apply to states/provinces
      let parentCountry = parents[labels.indexOf(label)];
      if (colorMapping[parentCountry]) {
        colorMapping[label] = lightenColor(colorMapping[parentCountry], 40); // Make it 40% lighter
      } else {
        colorMapping[label] = "#CCCCCC"; // Default gray if missing
      }
    }
  });

  // Generate a colorscale based on regions
  let nodeColors = labels.map(label => colorMapping[label] || "#CCCCCC"); // Default gray if no color
  
  ids.reverse();
  labels.reverse();
  parents.reverse();
  values.reverse();
  nodeColors.reverse();

  // Create Sunburst chart
  let trace = {
    type: "sunburst",
    labels: labels,
    parents: parents,
    values: values,
    ids: ids,
    branchvalues: "total", // Ensure hierarchy sums up correctly
    marker: {
      colors: nodeColors, // Only region colors, countries inherit from their region
      line: { width: 2, color: "white" } // Clean separator lines
    },
    hovertemplate: "<b>%{label}</b><br>Stores: %{value}<extra></extra>" // Clean hover text
  };

  let layout = {
    title: {
      text: "Starbucks Store Distribution (Continent > Country > State/Province)",
      font: {
        size: 24,
        color: "#006241", // Starbucks green
        family: "Arial Black, sans-serif"
      }
    },
    height: 650,
    margin: { t: 50, l: 0, r: 0, b: 0 },
    paper_bgcolor: "#EDE0C8", // Light coffee-cream background
    font: { family: "Verdana, sans-serif", color: "#3D2B1F" } // Coffee-themed font color
  };

  Plotly.newPlot("sunburst", [trace], layout);
}
