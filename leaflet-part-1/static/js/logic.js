// url for the json file
geoJsonUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// get data using d3
d3.json(geoJsonUrl).then((data) => {
    createMap(data.features);
});

function createMap(features) {

    function getColor(alt) {
        if (alt < 10) return "lightgreen"; //90EE90
        else if (alt < 30) return "green"; //008000
        else if (alt < 50) return "yellow"; //FFFF00
        else if (alt < 70) return "orange"; //FFA500
        else if (alt < 90) return "red"; //FF0000
        else return "darkred"; //8B0000
    }

    function pointCircle(point, latLng) {
        return L.circle([latLng["lat"], latLng["lng"]], {
            fillOpacity: 0.75,
            color: "black",
            fillColor: getColor(latLng["alt"]),
            radius: point.properties.mag * 10000,
        });
    }

    function addInfo(feature, layer) {
        layer.bindPopup(`<p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p><p>Location: ${feature.properties.place}</p>`)
    }

    let earthquakes = L.geoJSON(features, {
        pointToLayer: pointCircle,
        onEachFeature: addInfo
    });
    
    // Create the tile layer that will be the background of our map.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Create a map object.
    let myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [street, earthquakes]
    });

    function getHexColor(depth) {
        if (depth < 10) return "#90EE90";
        else if (depth < 30) return "#008000";
        else if (depth < 50) return "#FFFF00";
        else if (depth < 70) return "#FFA500";
        else if (depth < 90) return "#FF0000";
        else return "#8B0000";
    }

    // Set up the legend.
    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    let intervals = [-10, 10, 30, 50, 70, 90];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < intervals.length; i++) {
        div.innerHTML +=
            "<li style=\"background-color: " + getHexColor(intervals[i]) + "\">" + intervals[i] + (intervals[i + 1] ? ' &ndash; ' + intervals[i + 1] + '<br>' : '+')
             + "</li>";
    }

    return div;
  };

  // Adding the legend to the map
  legend.addTo(myMap);
    
}