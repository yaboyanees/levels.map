/*
 * Script to display two tables from Google Sheets as point using Leaflet
 * The Sheets are then imported using Tabletop.js and overwrite the initially laded layers
 */

// init() is called as soon as the page loads
function init() {
  var pointsURL = "https://docs.google.com/spreadsheets/d/1MvtG-2QBoLvjr3QSmvQKNsZ5eM82JoGJtzn0VAL_54k/edit?usp=sharing";

  Tabletop.init({ key: pointsURL, callback: addPoints, simpleSheet: true }); // simpleSheet assumes there is only one table and automatically sends its data
}
window.addEventListener("DOMContentLoaded", init);

// Create a new Leaflet map centered on the continental US
var map = L.map("map").setView([25, 0], 2.5);

// basemap
var CartoDB_Voyager = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 19
}).addTo(map);

var pointGroupLayer;


function addPoints(data) {
  if (pointGroupLayer != null) {
    pointGroupLayer.remove();
  }
  pointGroupLayer = L.layerGroup().addTo(map);

  for (var row = 0; row < data.length; row++) {
    var marker = L.marker([data[row].Latitude, data[row].Longitude]).addTo(
      pointGroupLayer
    );

    // POPUPS
    marker.bindPopup('<h4 style="margin:0 0 3px 0;"><a href="' + data[row].ApplyLink + '">' + data[row].Company + '</a></h4>(' + data[row].Locations + ')<br/><br/>Hiring:' + data[row].Roles);

    var companyIcon = L.Icon.extend({
        options: {
            iconSize: [28, 24],
        }
    });
    var logoIcon = new companyIcon(
        { iconUrl: data[row].Logo || 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/microsoft/209/briefcase_1f4bc.png' });

    marker.setIcon(logoIcon);
  }
  //console.log(data)
}
