var flightList = [];

function loadFlights() {
	$.getJSON(base + 'flight' + cookies.url).done(function(data){
		_.each(data,function(flight){
			var newFlight = new Flight(flight);
			flightList.push(newFlight);
			var route = [flight.route.origin.id,flight.route.destination.id].sort();
			routeList[route] = flight.route;
		});
		flightList = new FlightList(flightList);
		new FlightListView({el:'#flightList'});
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
		console.log(variables);
    var template = _.template($('#flightTemplate').html(),variables);
		console.log(template);
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
    this.listenTo(flightList, 'add', this.addOne);
  },
  render:function(){
    this.addAll();
  },
  addOne:function(flight){
		console.log(flight);
    var view = new FlightView({model: flight});
    this.$el.append(view.$el);
  },
  addAll:function(){
		var template = _.template($('#flightListTemplate').html());
    this.$el.html(template);
    flightList.each(this.addOne,this);
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
function maxFlights(route, aircraft) {
	var hours = (route.distance/aircraft.speend)
	var minutes = hours*60;
	var totalFlight = (minutes+turn_time);
	var frequencies = (10080(totalFlight*2));
	return frequencies;
}

var cabinType = {
	f:"first",
	j:"business",
	p:"premium economy",
	y:"economy"
}
