
function print(str) {
    document.getElementById('test1').innerHTML += str + '<br>';
}

function printJSON(json) {
    document.getElementById('test1').innerHTML += JSON.stringify(json, null, 2) + '<br>';
}

function cls() {
    document.getElementById('test1').innerHTML = '';
}


function foo() {
    cls();

    var pt1 = {
        "type": "Feature",
        "properties": {
          "marker-color": "#f00"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [-111.467285, 40.75766]
        }
      };

      printJSON(pt1);

      var pt2 = {
        "type": "Feature",
        "properties": {
          "marker-color": "#0f0"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [-111.873779, 40.647303]
        }
      };

      printJSON(pt2);

      var poly = {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Polygon",
          "coordinates": [[
            [-112.074279, 40.52215],
            [-112.074279, 40.853293],
            [-111.610107, 40.853293],
            [-111.610107, 40.52215],
            [-112.074279, 40.52215]
          ]]
        }
      };
      
      var features = {
        "type": "FeatureCollection",
        "features": [pt1, pt2, poly]
      };
      
      printJSON(poly);

      //=features
      
      var isInside1 = turf.inside(pt1, poly);
      
      var isInside2 = turf.inside(pt2, poly); 

      print(isInside1);
      print(isInside2);
}

var poly_coords = []
var mymap = undefined;
var polygon = undefined;
var drawing = false;
var ready_to_draw = false;

function pushCoords() {
    console.log(poly_coords);
}


function onMapClick(e) {
    if(!drawing) return;
    poly_coords[poly_coords.length] = [e.latlng.lat, e.latlng.lng];
    if(polygon != undefined) mymap.removeLayer(polygon);
    polygon = L.polygon(poly_coords, {color: '#015367'}).addTo(mymap);
}

function onMouseDown(e) {

    if(ready_to_draw) {
        ready_to_draw = false;
        drawing = true;
    }

    if(drawing) {
        poly_coords = []
        poly_coords[poly_coords.length] = [e.latlng.lat, e.latlng.lng];
        drawing = true;
    }
}

function onMouseUp(e) {
    if(drawing) {
        drawing = false;
        mymap.removeLayer(polygon);
        polygon = L.polygon(poly_coords, {color: '#015367'}).addTo(mymap);
        mymap.fitBounds(polygon.getBounds());
        pushCoords();
    }
    mymap.dragging.enable();
}

function onMouseMove(e) {
    if(drawing) {
        poly_coords[poly_coords.length] = [e.latlng.lat, e.latlng.lng];
        if(polygon != undefined) mymap.removeLayer(polygon);
        polygon = L.polyline(poly_coords, {color: '#015367'}).addTo(mymap);
        //mymap.fitBounds(polygon.getBounds());
    }
}

function initMap() { 
    mymap = L.map('map').setView([55.753215, 37.622504], 13);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox.streets',
      accessToken: 'pk.eyJ1IjoiZXBweTEiLCJhIjoiY2p0dGUzZ3dlMHRlNDRkbW01NnRrcWliOCJ9.-veJzgAvXB_SAGWwE-Ylew'
  }).addTo(mymap);

  mymap.on('click', onMapClick);
  mymap.on('mousedown ', onMouseDown);
  mymap.on('mousemove ', onMouseMove);
  mymap.on('mouseup ', onMouseUp);
}

function startDrawing() {
    mymap.dragging.disable();
    ready_to_draw = true;
    poly_coords = [];
    mymap.removeLayer(polygon);
}
function start() {
}

document.onload = start();