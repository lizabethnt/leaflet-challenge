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
        let time = quakeData.features[i].properties.time;
        let felt = quakeData.features[i].properties.felt;
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
            //   stroke: true,
              opacity: 1,
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

    // Create a baseMaps object.
    // var baseMaps = {
    //     "Street Map": street,
    // };

    // Create a layer group for the quake markers.
    var quakes = L.layerGroup(quakeMarkers);
    // var overlayMaps = {
    //     "Quakes in past 7 days": quakes,
    //   };

    // Define a map object.
    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [street, quakes]
    });

// TODO add legend to the map
});


