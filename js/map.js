var airportLayer = {
	markers:'',
	json:[]
};
var routeLayer = {};
var selectedAirport = {
	origin:{iata:''},
	destination:{iata:''},
	locked:false
};

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
	$('#map').on('click','.icon',function(e){
		popupAction(e);
	});
	/*$('#map').on('click','.icon.unlock',function(e){
		unlockAirportMarker(e);
	});
	$('#map').on('click','.icon.lock',function(e){
		lockAirportMarker(e);
	});
	$('#map').on('click','.icon.horizontal.resize',function(e){
		openAirportRoute(id);
	});*/
  airportLayer.markers.setGeoJSON(airportLayer.json);
  airportLayer.markers.on('click', function(e) {
  	selectAirportMarker(e);
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
function selectAirportMarker(e) {
	var popupContent = _.template($('#airportPopupTemplate').html(),e.layer.feature.properties.data);
  airportLayer.markers.bindPopup(popupContent,{
    closeButton: true,
    minWidth: 320
	});
	e.layer.openPopup();
	$('.leaflet-popup-close-button').on('click',function(e){
		closeAirportPopup(e);
	});
	feature = e.layer.feature;
	feature.properties['marker-color'] = '#aa0114';
	airportLayer.markers.setGeoJSON(airportLayer.json);
}
function popupAction(e) {
	var el = $(e.currentTarget);
	var id = el.attr('id');
	var marker = airportLayer.json.get('id',el.data('id'));
	if((el.hasClass('lock'))&&(el.hasClass('selected'))) {
		unlockAirportMarker(marker);
	} else if(el.hasClass('lock')) {
		lockAirportMarker(marker);
	} else if(el.hasClass('resize')) {
		openAirportRoute(marker);
	}
}
function lockAirportMarker(marker) {
	selectedAirport.origin = marker.properties.data;
	selectedAirport.selected = true;
	$('#lock' + marker.properties.id).addClass('selected');
}
function unlockAirportMarker(marker) {
	console.log(marker);
	selectedAirport.origin = {};
	selectedAirport.selected = false;
	$('#lock' + marker.properties.id).removeClass('selected');
}
function openAirportRoute(marker) {
	selectedAirport.destination = marker.properties.data;
	$('#airportroute' + marker.properties.id).addClass('selected');
}
function closeAirportPopup(e) {
	var id = $(e.currentTarget).parent().find('.icon').data('id');
	var layer = airportLayer.json.get('id',id);
	layer.properties['marker-color'] = '#548cba';
	airportLayer.markers.setGeoJSON(airportLayer.json);
	if(selectedAirport.destination.id === id) {
		selectedAirport.destination = {iata:''};
		$('.leaflet-marker-icon[title="' + selectedAirport.origin.name + ' (' + selectedAirport.origin.iata + ')"]').click();
	} else if(selectedAirport.origin.id === id) {
		if(selectedAirport.destination.id) {
			selectedAirport.origin = selectedAirport.destination;
			selectedAirport.destination = {iata:''};
			$('.leaflet-marker-icon[title="' + selectedAirport.origin.name + ' (' + selectedAirport.origin.iata + ')"]').click();
		} else {
			selectedAirport.origin = {iata:''}
			selectedAirport.locked = false;
		}
	} else {
		selectedAirport.origin = {iata:''}
		selectedAirport.destination = {iata:''};
		selectedAirport.locked = false;
	}
}

Array.prototype.get = function(key,value){ var result; _.each(this,function(item){ if(item.properties[key] === value){ result = item; } }); return result; }
