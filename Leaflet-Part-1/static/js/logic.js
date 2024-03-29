// read in json data file samples.json
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

let quakeData;

dataPromise.then(function (data) {
    quakeData = data;
    console.log("quakeData: ", quakeData);
});
