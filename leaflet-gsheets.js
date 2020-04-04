/* global L Tabletop */

/*
 * Script to display two tables from Google Sheets as point and polygon layers using Leaflet
 * The Sheets are then imported using Tabletop.js and overwrite the initially laded layers
 */

// init() is called as soon as the page loads
function init() {
  var pointsURL =
    "https://docs.google.com/spreadsheets/d/1MvtG-2QBoLvjr3QSmvQKNsZ5eM82JoGJtzn0VAL_54k/edit?usp=sharing";

  Tabletop.init({ key: pointsURL, callback: addPoints, simpleSheet: true }); // simpleSheet assumes there is only one table and automatically sends its data
}
window.addEventListener("DOMContentLoaded", init);

// Create a new Leaflet map centered on the continental US
var map = L.map("map").setView([40, -100], 4);

// This is the Carto Positron basemap
var basemap = L.tileLayer(
  "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png",
  {
    attribution:
      "&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> &copy; <a href='http://cartodb.com/attributions'>CartoDB</a>",
    subdomains: "abcd",
    maxZoom: 19
  }
);
basemap.addTo(map);

var sidebar = L.control
  .sidebar({
    container: "sidebar",
    closeButton: true,
    position: "right"
  })
  .addTo(map);

let panelID = "my-info-panel";
var panelContent = {
  id: panelID,
  tab: "<i class='fa fa-bars active'></i>",
  pane: "<p id='sidebar-content'></p>",
  title: "<h2 id='sidebar-title'>No state selected</h2>"
};
sidebar.addPanel(panelContent);

map.on("click", function() {
  sidebar.close(panelID);
});

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

    // UNCOMMENT THIS LINE TO USE POPUPS
    //marker.bindPopup('<h2>' + data[row].location + '</h2>There's a ' + data[row].level + ' ' + data[row].category + ' here');

    // COMMENT THE NEXT 14 LINES TO DISABLE SIDEBAR FOR THE MARKERS
    marker.feature = {
      properties: {
        Company: data[row].Company,
        Roles: data[row].Roles
      }
    };
    marker.on({
      click: function(e) {
        L.DomEvent.stopPropagation(e);
        document.getElementById("sidebar-title").innerHTML =
          e.target.feature.properties.location;
        document.getElementById("sidebar-content").innerHTML =
          e.target.feature.properties.category;
        sidebar.open(panelID);
      }
    });

    // AwesomeMarkers is used to create fancier icons
    var icon = L.AwesomeMarkers.icon({
      icon: "info-sign",
      iconColor: "white",
      markerColor: getColor(data[row].Company),
      prefix: "glyphicon",
      extraClasses: "fa-rotate-0"
    });
    marker.setIcon(icon);
  }
}

// Returns different colors depending on the string passed
// Used for the points layer
/*function getColor(type) {
  switch (type) {
    case "Coffee Shop":
      return "green";
    case "Restaurant":
      return "blue";
    default:
      return "green";
  }
}*/
