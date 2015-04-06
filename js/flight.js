var flightList = [];
var selectedFlight;
var cabinType = {
	f:"first",
	j:"business",
	p:"premium economy",
	y:"economy"
}

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
	selectedFlight = flight;
	(function(){
    return Q.all(_.map(showRoute(flight.get('route').id)));
	})().then(function(){
		createFlightInfoView(flight);
	});
}
function createFlightInfoView(flight) {
	selectedFlight = flight;
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
	$('.flight-list .ui.dividing.header.airport.alliance').removeClass('active');
	if(flight.attributes.userAircraft) {
		$('.flight-list .ui.dividing.header.airport.alliance[data-flightid="' + flight.id + '"]').addClass('active');
		$('#saveFlightButton').on('click',function(){
			updateFlight();
		});
		$('#cancelFlightButton').on('click',function(){
			cancelFlight();
	});
	} else {
		$('#launchFlightButton').on('click',function(){
			createFlight();
		});
	}
	$('#cancelButton').on('click',function(){
		cancelFlightView();
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
	_.each(newAircraft.get('configuration').config,function(cabin,code){
		if(cabin.count > 0) {
			$('.ui.tab.segment[data-tab="' + code + '"] .row:not(.noclass)').css({display:'block'});
			$('.ui.tab.segment[data-tab="' + code + '"] .row[data-rowtype="capacity"] span:not(.label)').html(cabin.count);
			$('.ui.tab.segment[data-tab="' + code + '"] .row.noclass').css({display:'none'});
		} else {
			$('.ui.tab.segment[data-tab="' + code + '"] .row:not(.noclass)').css({display:'none'});
			$('.ui.tab.segment[data-tab="' + code + '"] .row.noclass').css({display:'block'});
		}
	});
		$('.ui.selection.dropdown').removeClass('error').removeAttr('data-html');
}
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
function serializeFlight() {
	var flight = {
		route_id:0,
		user_aircraft_id:0,
		frequencies:0,
		fare:{
			f:0,
			j:0,
			p:0,
			y:0
		}
	}
	flight.route_id = parseInt(selectedRoute.get('id'));
	flight.user_aircraft_id = parseInt($('#aircraftInput').val());
	flight.frequencies = parseInt($('input[name="weeklyFrequencies"]').val());
	_.each(flight.fare,function(value,key){
		flight.fare[key] = parseInt($('div[data-rowtype="fare"] input[name="' + key + 'fare"]').val());
	});
	return flight;
}
function updateFlight() {
	var data = serializeFlight();
	var id = selectedFlight.get('id');
	var oldAircraft = selectedFlight.get('userAircraft');
	$.post(base + 'flight/' + id + cookies.url, {_method:'PUT',flight:data}).done(function(data){
		if(data.userAircraft){
			var updatedFlight = new Flight(data);
			var index = selectedRoute.get('flights').own.indexOf(selectedFlight);
			userAircraftList.get(data.userAircraft.id).set('flight',updatedFlight).set('inuse',true);
			userAircraftList.get(oldAircraft.id).set('flight',null).set('inuse',false);
			flightList.remove(selectedFlight);
			flightList.add(updatedFlight);
			selectedRoute.get('flights').own.splice(index, 1);
			selectedRoute.get('flights').own.push(updatedFlight);
			selectedFlight = updatedFlight;
			$('#flight' + id + ' .value.route').html(data.userAircraft.aircraft.name + ' (' + data.frequencies + '/week)');
		} else if(Array.isArray(data)) {
			flightErrors(data);
		}
	});
}
function newFlight() {
	var routeId = $('.route-info').data('routeid');
	var emptyFlight = {
		route:selectedRoute.attributes,
		profit:0,
		duration:0,
		frequencies:1,
		userAircraft:null
	}
	selectedFlight = {attributes:emptyFlight};
	createFlightInfoView({attributes:emptyFlight});
}
function createFlight() {
	var data = serializeFlight();
	if(!userAircraftList.get(data.user_aircraft_id)) {
		$('.ui.selection.dropdown').addClass('error').attr('data-html','Please select an aircraft').popup('show');
	} else {
		$.post(base + 'flight' + cookies.url, {flight:data}).done(function(data){
			if(data.userAircraft) {
				var newFlight = new Flight(data);
				userAircraftList.get(data.userAircraft.id).set('flight',newFlight).set('inuse',true);
				flightList.add(newFlight);
				selectedFlight = newFlight;
				selectedRoute.get('flights').own.push(newFlight);
				var variables = data;
				var newFlightView = new FlightView({model:newFlight});
				$('.ui.one.bottom.attached.buttons.create').after(newFlightView);
			} else if(Array.isArray(data)) {
				flightErrors(data);
			}
		});
	}
}
function flightErrors(data) {
	$('.ui.selection.dropdown').addClass('error').attr('data-html','');
	var errors = []
	if(data.indexOf('aircraft is already in use') >= 0) {
		errors.push('Selected aircraft is in use');
	}
	if(data.indexOf('flight is longer than aircraft range') >= 0) {
		errors.push('Selected aircraft does not have suitable range');
	}
	if(data.indexOf('more frequencies than aircraft can fly') >= 0) {
		errors.push('Selected aircraft cannot fly that many frequencies');
	}
	$('.ui.selection.dropdown').attr('data-html',errors.join('<br>')).popup('show');
}