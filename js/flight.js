var flightList = [];

function loadFlights() {
	$.getJSON(base + 'flight' + cookies.url).done(function(data){
		_.each(data,function(flight){
			flightList.push(new Flight(flight));
			var route = [flight.route.origin.id,flight.route.destination.id].sort();
			routeList[route] = flight.route;
		});
		flightList = new FlightList(flightList);
		new FlightListView({el:'#routeList'});
	});
}

var Flight = Backbone.Model.extend({
});

var FlightList = Backbone.Collection.extend({
	model:Flight
});

var FlightView = Backbone.View.extend({
  initialize:function(){
    this.render();
  },
  render:function(){
    var variables = this.model.attributes;
    var template = _.template($('#flightTemplate').html(),variables);
    this.$el.html(template);
    return this;
  },
	events:{
		'click .airport.header':'showFlight'
	},
	showFlight:function(e){
		showFlight(this.model);
	}
});

var FlightListView = Backbone.View.extend({
  initialize:function(){
    this.render();
    this.listenTo(airportList, 'add', this.addOne);
  },
  render:function(){
    this.addAll();
  },
  addOne:function(flight){
    var view = new FlightView({model: flight});
    this.$el.append(view.$el);
  },
  addAll:function(){
		var template = _.template($('#flightListTemplate').html());
    this.$el.html(template);
    airportList.each(this.addOne,this);
  }
});

function calculateDuration(distance, speed) {
  var duration = 40;
  duration += ((distance/speed)*60);
  return Math.round(duration);
}
function maxFrequencies(duration,turn_time) {
  return Math.floor(10080/(turn_time+duration)/2);
}
function minutesToHours(minutes) {
  var hours = Math.floor(minutes/60);
  var minutes = (minutes%60);
  return hours + ":" + minutes;
}
