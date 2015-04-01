var airportLayer = {
	markers:'',
	json:[]
};
var routeLayer = {};


var globalMap;
(function(){
	sizeMap();
	loadMap();
})();

function sizeMap() {
  $('#map').css({width:$(window).width()-300});
}
function loadMap(){
  L.mapbox.accessToken = 'pk.eyJ1Ijoia3ppZWwiLCJhIjoiaVROWDVNcyJ9.hxCBMTpnmZjG8X_03FYMBg';
  var map = L.mapbox.map('map', 'kziel.l04pnpnd', {
    attributionControl: false,
    infoControl: true,
    minZoom:2,
    maxZoom:14
  }).setView([39.8282,-98.5795], 5);
  map.setMaxBounds([[-90,-180], [90,180]]);
  globalMap = map;
}
function latlon(obj) {
  var ll = {}
  if(obj.x) {
    ll.lat = obj.y;
    ll.lon = obj.x;
  } else if(obj.latitude) {
    ll.lat = obj.latitude;
    ll.lon = obj.longitude;
  } else {
    ll = obj
  }
  return L.latLng(ll);
}
function latlonarr(obj) {
	return [obj.longitude,obj.latitude];
}
function addAirportMarkers(airports) {
	_.each(airports,function(airport){
	  airportLayer.json.push(createAirportMarker({data:airport,coordinates:latlonarr(airport.coordinates),markerId:airport.id}));
	});
	airportLayer.markers = L.mapbox.featureLayer().addTo(globalMap);
	airportLayer.markers.on('layeradd', function(e) {
    var marker = e.layer,
		feature = marker.feature;
		var airport = feature.properties.data
    var popupContent =  '' + airport.name + ' (' + airport.iata + ')<br>' + feature.properties.data.city + ', ' + feature.properties.data.country + '';
    marker.bindPopup(popupContent,{
        closeButton: false,
        minWidth: 320
    });
	});
  airportLayer.markers.setGeoJSON(airportLayer.json);
  airportLayer.markers.on('click', function(e) {
  	loadAirport(e.layer);
  });
}
function createAirportMarker(args) {
  var json = {
    type: 'Feature',
    properties: {
      'marker-color': '#548cba',
      'marker-size': 'medium',
      'marker-symbol': 'airport',
      'id':args.data.id,
      'title': args.data.name + ' (' + args.data.iata + ')',
			'data': args.data
    },
    geometry: {
      type: 'Point',
      coordinates: args.coordinates
    }
  }
  return json;
}
function loadAirport(e) {
	console.log(e);
}