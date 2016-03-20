var routeList = {}
var selectedRoute;

function showRoute(id, flight) {
	if(id.constructor === Array) {
		id = id.join('/');
	}
	$.getJSON(base + 'route/' + id + cookies.url).done(function(data){
		var flights = {
			own:[],
			comp:[]
		};
		_.each(data.flights,function(flight){
			if(flight.airline.id === airline.id) {
				flights.own.push(new Flight(flight));
			} else {
				flights.comp.push(new Flight(flight));
			}
		});
		data.flights = flights
		selectedRoute = new Route(data);
    var route = data;
    route.origin = airportList.get(route.origin.id).attributes;
    route.destination = airportList.get(route.destination.id).attributes;
    activeRoutes[route.id] = route;
    drawRoute({origin:route.origin,dest:route.destination,type:'highlight'});
		new RouteView({model:selectedRoute});
		$('#routePanel').on('click','.create',function(){
			newFlight();
		}).on('click','.header.airport',function(){
			var flight = flightList.get($(this).data('flightid'));
			createFlightInfoView(flight);
		});
		if(flight) {
			createFlightInfoView(flight);
		}
		graphRouteShares(data)
	});
}
var Route = Backbone.Model.extend({
});
var RouteView = Backbone.View.extend({
  initialize:function(){
    this.render();
  },
  render:function(){
    var variables = this.model.attributes;
    var template = _.template($('#routeModalTemplate').html(),variables);
		$('#routePanel').remove();
		$('body').append(template);
		$('#routePanel').modal('show');
		drawRouteMarketShare(variables.marketShares);
		$('.route-info').on('click','.info',function(){
			$(".flight-info#marketShares").css({display:'block'});
			$('.flight-info#flightInfo').css({display:'none'});
		});
		return true;
  },
  events:{
  	'click .create':'newFlight'
  }
});
var RouteFlightView = Backbone.View.extend({
  initialize:function(){
    this.render();
  },
  render:function(){
    var variables = this.model.attributes;
    var template = _.template($('#routeModalTemplate').html(),variables);
  }
});
function drawRouteMarketShare(marketShares) {
	var template = _.template($('#routeMarketShareTemplate').html(),{marketShares: marketShares});
	$(".flight-info#marketShares").html(template);
	$('table#routeMarketShareTable').tablesort().data('tablesort').sort($("th.default-sort"));
}
function graphRouteShares(route) {
	var graphColors = [{color:"#058DC7",highlight: "#FF5A5E"},{color: "#50B432",highlight: "#5AD3D1"},{color: "#ED561B",highlight: "#FFC870"},{color:"#DDDF00",highlight: "#FF5A5E"},{color: "#24CBE5",highlight: "#5AD3D1"},{color: "#64E572",highlight: "#FFC870"},{color:"#FF9655",highlight: "#FF5A5E"},{color: "#FFF263",highlight: "#5AD3D1"},{color: "#6AF9C4",highlight: "#FFC870"},{color: "#46BFBD",highlight: "#5AD3D1"},{color: "#FDB45C",highlight: "#FFC870"},{color:"#F7464A",highlight: "#FF5A5E"},{color: "#46BFBD",highlight: "#5AD3D1"},{color: "#FDB45C",highlight: "#FFC870"},{color:"#F7464A",highlight: "#FF5A5E"},{color: "#46BFBD",highlight: "#5AD3D1"},{color: "#FDB45C",highlight: "#FFC870"}];
	var airlines = route.marketShares;
	if(airlines.length > 0) {
		$('.route-market-shares').css({display:'block'});
	} else {
		$('.route-market-shares').css({display:'block'}).html('<h2 class="ui header">No airlines serve this route</h2>');
	}
  var totalCapacity = 0;
  var totalPassengers = 0;
  airlines.sort(function(a, b) {
    return a.capacity - b.capacity;
  }).reverse();
  var capacityData = [];
	var passengerData = [];
  var i = 0;
	var otherCapacityData = {
		value: 0,
		label: "Others",
		highlight: graphColors[11].color,
		color: graphColors[11].color
	};
	var otherPassengerData = {
		value: 0,
		label: "Others",
		highlight: graphColors[11].color,
		color: graphColors[11].color
	};
  _.each(airlines, function(airline) {
    if(i <= 10) {
      var capacity = {
        value: airline.capacity,
        label: airline.airline.name,
        highlight: graphColors[i].color,
        color: graphColors[i].color
      };
      var passenger = {
        value: airline.passengers,
        label: airline.airline.name,
        highlight: graphColors[i].color,
        color: graphColors[i].color
      };
      capacityData.push(capacity);
      passengerData.push(passenger);
      i++;
    } else {
			otherCapacityData["value"] += airline.capacity;
			otherPassengerData["value"] += airline.passengers;
		}
  });
	capacityData.push(otherCapacityData);
	passengerData.push(otherPassengerData);
  var capacityChart = $("#routeCapacity").get(0).getContext("2d");
  var passengerChart = $("#routePassengers").get(0).getContext("2d");
  var capacityPieChart = new Chart(capacityChart).Pie(capacityData,{animation:false});
  var passengerPieChart = new Chart(passengerChart).Pie(passengerData,{animation:false});
}

var activeRoutes = {};
var allRoutes = {};
var selectedFlight, selectedRoute;

function drawRoutes() {
  clearRoutes();
  flightList.each(function(value){
    var route = value.get('route');
    if(route) {
      route.origin = airportList.get(route.origin.id).attributes;
      route.destination = airportList.get(route.destination.id).attributes;
      activeRoutes[route.id] = route;
      drawRoute({origin:route.origin,dest:route.destination,type:'normal'});
    }
  });
}
function clearRoutes() {
  $.each(allRoutes,function(key,value){
    globalMap.removeLayer(value);
  });
}
function highlightRoutes(id) {
  unhighlightRoutes();
  _.each(allRoutes,function(value, key){
    if((value.origin.id === id)||(value.dest.id === id)) {
      drawRoute({origin:value.origin,dest:value.dest,type:'highlight'});
    }
  });
}
function unhighlightRoutes() {
  _.each(allRoutes,function(value, key){
    if((value.linetype === 'new')||(value.linetype === 'highlight')) {
      drawRoute({origin:value.origin,dest:value.dest,type:'normal'});
    }
  });
}
function drawRoute(args) {
  var origin = args.origin;
  var dest = args.dest;
  if(origin === dest) {
    return true;
  }
  var type = args.type;
  var lineid = 'route' + origin.id + dest.id;
  var lineid2 = 'route' + dest.id + origin.id;
  if(allRoutes[lineid]) {
    globalMap.removeLayer(allRoutes[lineid]);
    delete allRoutes[lineid];
  }
  if(allRoutes[lineid2]) {
    globalMap.removeLayer(allRoutes[lineid2]);
    delete allRoutes[lineid2];
  }
  if(type === 'new') {
    routeSettings = {
      color: '#eeaa77',
      weight: 3,
      opacity: 1
    }
  } else if(type === 'highlight') {
    routeSettings = {
      color: '#aa0114',
      weight: 2,
      opacity: 1
    }
  } else {
    routeSettings = {
      color: '#548cba',
      weight: 2,
      opacity: 1
    }
    type = 'normal';
  }
  var start = { x: origin.coordinates.longitude, y: origin.coordinates.latitude };
  var end = { x: dest.coordinates.longitude, y: dest.coordinates.latitude };
  var generator = new arc.GreatCircle(start, end);
  var line = generator.Arc(100, { offset: 10 });
  var newLine = L.polyline(line.geometries[0].coords.map(function(c) {
    return c.reverse();
  }),routeSettings);
  newLine.addTo(globalMap);
  newLine.linetype = type;
  newLine.origin = origin;
  newLine.dest = dest;
  allRoutes[lineid] = newLine;
}
function viewRoute(args) {
  var origin = airports[args.origin];
  var dest = airports[args.dest];
  var exists = false;
  var route_id;
  _.each(activeRoutes,function(route,key){
    route.origin = airports[route.origin_id];
    route.dest = airports[route.destination_id];
    var routeDest = route.dest;
    var routeOrigin = route.origin;
    if(((routeOrigin.id === origin.id)&&(routeDest.id === dest.id))||((routeDest.id === origin.id)&&(routeOrigin.id === dest.id))) {
      exists = true;
      route_id = route.id;
    }
  });
  if(exists) {
    loadExistingRoute(route_id);
  } else {
    loadNewRoute({origin:origin.id,dest:dest.id});
  }
}
