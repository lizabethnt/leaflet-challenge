// read in json data file samples.json
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

let quakeData;

dataPromise.then(function (data) {
    quakeData = data;
    console.log("quakeData: ", quakeData);
    let quakeMarkers = [];
    for(let i = 0; i<quakeData.features.length; i++) {
        let magnitude = quakeData.features[i].properties.mag;
        let place = quakeData.features[i].properties.place;

        var coordinates = quakeData.features[i].geometry.coordinates;
        function chooseColor(depth) {
            if (depth >= 90) return "darkred";
            else if (depth >= 70) return "red";
            else if (depth >= 50) return "orange";
            else if (depth >= 30) return "darkgreen";
            else if (depth >= 10) return "green";
            else return "lightgreen";
          }
        let marker = 
            L.circle([coordinates[1], coordinates[0]], {
              opacity: .75,
              fillOpacity: .9,
              color: "black",
              weight: 1,
              fillColor: chooseColor(coordinates[2]),
              radius: magnitude*7500
            })

            marker.bindTooltip("<h3>" + `magnitude: ` + magnitude 
            // + "</h3><hr><p>" + `felt?: ` + felt + "</p>"
            + "</h3><hr><p>" + `location: ` +place + "</p>" 
            + "</h3><hr><p>" + `depth: ` + coordinates[2] + "</p>").openTooltip();
            // + "</h3><hr><p>" + `time: ` + new Date(time) + "</p>").openTooltip();
            quakeMarkers.push(marker);
    }     
    console.log("quakeMarkers: ", quakeMarkers);
    // Create the base layer
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    // Create a layer group for the quake markers.
    var quakes = L.layerGroup(quakeMarkers);

    // Define a map object.
    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [street, quakes]
    });

    //add legend to the map, written with help from AI and powepoint from TA Henry
    // add a control positioning the legend on the map
    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function() {
    // create the div with a class "info legend"
      var div = L.DomUtil.create('div', 'info legend');
    // create limits, colors, labels
      var limits = [-10, 10, 30, 50, 70, 90];
      var colors = ["lightgreen", "green", "darkgreen", "orange", "red", "darkred"];
      var labels = ["< 10", "10 to 30", "30 to 50", "50 to 70", "70 to 90", "> 90"];
    // Create a title for the legend
      var legendInfo = "<h1>Depth in km</h1>";
        div.innerHTML = legendInfo;
    // loop through our limits and generate a label with a colored square for each interval
      for (var i = 0; i < limits.length; i++) {
        div.innerHTML +=
          '<div class="color-box" style="background-color:' + colors[i] + '"></div>' +
          '<span>' + labels[i] + '</span><br>';
      }
    
      return div;
    };
    // add the legend to the map
    legend.addTo(myMap);

});


