var flightList = [];
var selectedFlight;

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
		selectedFlight = this.model;
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
    this.listenTo(flightList, 'add', this.addOne);
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
    flightList.each(this.addOne,this);
  }
});
function showFlight(flight) {
	(function(){
    return Q.all(_.map(showRoute(flight.get('route').id)));
	})().then(function(){
		var template = _.template($('#flightInfoTemplate').html(),flight.attributes);
  	$('.flight-info').html(template);
	  $('#classMenu').on('click','a',function(){
	    $(this).addClass('active').closest('.ui.menu').find('.item').not($(this)).removeClass('active');
	    $(this).closest('.tab').find('div').addClass('open').not('[data-tab="' + $(this).data('tab') + '"]').removeClass('open');
	  });
		$('.route-panel .tab .segment[data-tab="f"]').addClass('open');
		$('.flight-info').on('input change','input[type="range"]',function(){
			var el = $(this);
			var dollar = '';
			if(el.attr('name').match(/fare/)) {
				dollar = '$';
			}
			$('#' + el.attr('name')).html(dollar + comma(el.val()));
		});
		$('.flight-info input[type="range"]').each(function(){
			var el = $(this);
			var dollar = '';
			if(el.attr('name').match(/fare/)) {
				dollar = '$';
			}
			$('#' + el.attr('name')).html(dollar + comma(el.val()));
		});
		$('.ui.selection.dropdown').dropdown().find('#aircraftInput').on('input change',function(){
			changeFlightAircraft($(this).val());
		});
	});
}
function changeFlightAircraft(id) {
	var newAircraft = userAircraftList.get(id);
	var duration = calculateDuration(selectedRoute.get('distance'),newAircraft.get('aircraft').speed);
	var maxFreq = maxFrequencies(duration, newAircraft.get('aircraft').turn_time);
	$('.row[data-rowtype="flight-duration"] span:not(.label)').html(minutesToHours(duration));
	$('input[name="weeklyFrequencies"]').attr('max',maxFreq);
	if(maxFreq < $('input[name="weeklyFrequencies"]').val()) {
		$('input[name="weeklyFrequencies"]').attr('value',maxFreq);
		$('#weeklyFrequencies').html(maxFreq);
	}
}
function calculateDuration(distance, speed) {
  var duration = 40;
  duration += ((distance/speed)*60);
  return Math.round(duration);
}
function maxFrequencies(duration,turn_time) {
	console.log(duration, turn_time)
  return Math.floor(10080/(turn_time+duration)/2);
}
function minutesToHours(minutes) {
  var hours = Math.floor(minutes/60);
  var minutes = (minutes%60);
  return hours + ":" + minutes;
}
function maxFlights(route, aircraft) {
	var hours = (route.distance/aircraft.speed);
	var minutes = hours*60;
	var totalFlight = (minutes+aircraft.turn_time);
	var frequencies = (10080/(totalFlight*2));
	return Math.floor(frequencies);
}
function configurationInfo(cabin){
	var variables = selectedFlight.attributes;
	variables.cabin = cabin;
	var template = _.template($('#cabinInfoTemplate').html(),variables);
	return template
}

var cabinType = {
	f:"first",
	j:"business",
	p:"premium economy",
	y:"economy"
}
