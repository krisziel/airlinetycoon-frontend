var Airport = Backbone.Model.extend({
  initialize:function(){
  },
	equipmentSwap:function(newEquipment){
		this.set({name:newEquipment});
	}
});

var AirportList = Backbone.Collection.extend({
  model:Airport
});

var AirportView = Backbone.View.extend({
  initialize:function(){
    this.render();
    this.listenTo(this.model, 'add', this.render);
  },
  render:function(){
    var variables = this.model.attributes;
    var template = _.template($('#airportTemplate').html(),variables);
    this.$el.html(template);
    return this;
  },
	events:{
		'click':'loadAirport'
	},
	loadAirport:function(e){
		$('.leaflet-marker-icon[title="' + this.model.attributes.name + ' (' + this.model.attributes.iata + ')"]').click();
	}
});

var AirportListView = Backbone.View.extend({
  initialize:function(){
    this.render();
    this.listenTo(airportList, 'add', this.addOne);
  },
  render:function(){
    this.addAll();
  },
  addOne:function(airport){
    var view = new AirportView({model: airport});
    this.$el.append(view.$el);
  },
  addAll:function(){
		var template = _.template($('#airportListTemplate').html());
    this.$el.html(template);
    airportList.each(this.addOne,this);
  },
	events:{
		'keyup input.search.airport':'searchAirports'
	},
	searchAirports:function(e){
		var input = $(e.currentTarget);
		var airport = input.val().toUpperCase();
		$('#airportList').find('.ui.dividing.header.airport.none').css({display:'none'});
		if(airport.length === 0) {
			$('#airportList').find('.ui.dividing.header.airport').css({display:'block'});
			$('#airportList').find('.ui.dividing.header.airport.none').css({display:'none'});
		} else {
			$('#airportList').find('.ui.dividing.header.airport').css({display:'none'});
			var airports = $('#airportList').find('.ui.dividing.header.airport[data-iata*="' + airport + '"]');
			_.each(airports,function(airport){
				$(airport).css({display:'block'});
			});
			if((airports.length === 0)&&(airport.length > 0)) {
				$('#airportList').find('.ui.dividing.header.airport.none').css({display:'block'});
			}
		}
	}
});

var airports = [];
var airportList;
function loadAirports(){
	$.getJSON(base + 'airport').done(function(data){
		addAirportMarkers(data);
	  _.each(data,function(airport){
	    airportItem = new Airport(airport);
	    airports.push(airportItem);
		});
	  airportList = new AirportList(airports);
	  new AirportListView({el:'#airportList'});
		loadFlights();
	});
}
function loadAirport(id) {
	$.getJSON(base + 'airport/' + id + cookies.url).done(function(data){
    var template = _.template($('#airportInfoModalTemplate').html(), data);
    $('body').append(template);
  	$('#airportPanel').modal('show');
    var colors = [
      {
        color:"#F7464A",
        highlight: "#FF5A5E"
      },
      {
        color: "#46BFBD",
        highlight: "#5AD3D1"
      },
      {
        color: "#FDB45C",
        highlight: "#FFC870"
      },
      {
        color:"#F7464A",
        highlight: "#FF5A5E"
      },
      {
        color: "#46BFBD",
        highlight: "#5AD3D1"
      },
      {
        color: "#FDB45C",
        highlight: "#FFC870"
      },
      {
        color:"#F7464A",
        highlight: "#FF5A5E"
      },
      {
        color: "#46BFBD",
        highlight: "#5AD3D1"
      },
      {
        color: "#FDB45C",
        highlight: "#FFC870"
      }
    ]
    graphAirportDestinations(data.marketShares.airlines);
    graphAirportFlights(data.marketShares, colors)
	});
}
function loadAirportAirlines() {
  var ctx = $("#chart1").get(0).getContext("2d");
  var data = [
    {
        value: 300,
        color:"#F7464A",
        highlight: "#FF5A5E",
        label: "Red"
    },
    {
        value: 50,
        color: "#46BFBD",
        highlight: "#5AD3D1",
        label: "Green"
    },
    {
        value: 100,
        color: "#FDB45C",
        highlight: "#FFC870",
        label: "Yellow"
    }
  ]
  var myPieChart = new Chart(ctx).Pie(data,{});
}
function graphAirportDestinations(airlines, colors) {
  var airlineNames = [];
  var destinationCount = [];
  airlines.sort(function(a, b) {
    return a.destinations - b.destinations;
  }).reverse();
  _.each(airlines, function(airline) {
    airlineNames.push(airline.airline.icao);
    destinationCount.push(airline.destinations);
  });
  var data = {
    labels: airlineNames,
    datasets: [
      {
          label: "Destination Count By Airline",
          fillColor: "rgba(33, 133, 208,0.5)",
          strokeColor: "rgba(33, 133, 208,0.8)",
          highlightFill: "rgba(33, 133, 208,0.75)",
          highlightStroke: "rgba(33, 133, 208,1)",
          data: destinationCount
      }
    ]
  };
  var ctx = $("#chart1").get(0).getContext("2d");
  var destinationChart = new Chart(ctx).Bar(data, {});
}
function graphAirportFlights(airport, colors) {
  var totalFlights = airport.airport.flights;
  var remainingFlights = totalFlights;
  var airlines = airport.airlines;
  airlines.sort(function(a, b) {
    return a.flights - b.flights;
  }).reverse();
  var data = []
  var i = 0;
  _.each(airlines, function(airline) {
    if(airline.flights > (totalFlights/8)) {
      var airlineData = {
        value: airline.flights,
        label: airline.airline.icao,
        highlight: graphColors[i].highlight,
        color: graphColors[i].color
      };
      data.push(airlineData);
      i++;
      remainingFlights -= airline.flights;
    }
  });
  if(remainingFlights > 0) {
    var airlineData = {
      value: remaingingFlights,
      label: "Other",
      highlight: graphColors[i].highlight,
      color: graphColors[i].color
    };
  }
  var ctx = $("#chart2").get(0).getContext("2d");
  var myPieChart = new Chart(ctx).Pie(data,{});
}
function graphAirportPassengers(airport, colors) {
  var totalPassengers = airport.airport.passengers;
  var remaningPassengers = totalPassengers;
  var airlines = airport.airlines;
  airlines.sort(function(a, b) {
    return a.passengers - b.passengers;
  }).reverse();
  var data = []
  var i = 0;
  _.each(airlines, function(airline) {
    if(airline.passengers > (totalPassengers/8)) {
      var airlineData = {
        value: airline.passengers,
        label: airline.airline.icao,
        highlight: graphColors[i].highlight,
        color: graphColors[i].color
      };
      data.push(airlineData);
      i++;
      remaningPassengers -= airline.passengers;
    }
  });
  if(remainingFlights > 0) {
    var airlineData = {
      value: remaingingPassengers,
      label: "Other",
      highlight: graphColors[i].highlight,
      color: graphColors[i].color
    };
  }
  var ctx = $("#chart3").get(0).getContext("2d");
  var myPieChart = new Chart(ctx).Pie(data,{});
}
