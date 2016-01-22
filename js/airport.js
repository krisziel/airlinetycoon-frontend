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
function loadAirportDestinations() {
  var ctx = $("#chart2").get(0).getContext("2d");
  var data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
        {
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
            label: "My Second dataset",
            fillColor: "rgba(151,187,205,0.5)",
            strokeColor: "rgba(151,187,205,0.8)",
            highlightFill: "rgba(151,187,205,0.75)",
            highlightStroke: "rgba(151,187,205,1)",
            data: [28, 48, 40, 19, 86, 27, 90]
        }
    ]
  };
  var myBarChart = new Chart(ctx).Bar(data, {});
}
function loadAirportFlights() {

}
