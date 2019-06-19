// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

// // Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
//   // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function getColor(mag) {
    return mag > 6 ? '#800026' :
        mag > 5  ? '#BD0026' :
        mag > 4  ? '#E31A1C' :
        mag > 3  ? '#FC4E2A' :
        mag > 2  ? '#FD8D3C' :
        mag > 1  ? '#FEB24C' : '#FED976';
  }

function createFeatures(earthquakeData) {


  function pointToLayer2(feature, latlng) {
    var geojsonMarkerOptions = {
      radius: feature.properties.mag * 2,
      //fillColor: "#ff7800",
      fillColor: getColor(feature.properties.mag),
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };

    return L.circleMarker(latlng, geojsonMarkerOptions);
  }


//   // Define a function we want to run once for each feature in the features array
//   // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature2(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
         "</h3><hr><p> Magnitude:" + (feature.properties.mag) + "</p>");
  }
//   // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature2,
    pointToLayer: pointToLayer2
  });

 
  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

   var baseMaps = {
    "Street Map": streetmap
  };


  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var map = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);



var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'legend'),
      grades = [0, 1, 2, 3, 4, 5, 6, 7, 8],
      labels = [];

      div.innerHTML+='Magnitude<br><hr>'
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }
  
  return div;
  };
  
  legend.addTo(map);

};