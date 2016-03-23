var airline;

var Airline = Backbone.Model.extend({
});
var AirlineList = Backbone.Collection.extend({
});
var AirlineView = Backbone.View.extend({
});
var AirlineListView = Backbone.View.extend({
});
function showAirlineInfo(id) {
	$.getJSON(base + 'airline/' + id + cookies.url).done(function(airline){
		if(airline.error) {

		} else {
			$('.ui.standard.modal.airline.info').remove();
	    var template = _.template($('#airlineModalView').html(),airline);
	    $('body').append(template);
			_.each(airline.flights,function(flight){
				var flightTemplate = _.template($('#airlineModalFlightView').html(),flight)
				$('#airlineRouteList').append(flightTemplate);
			});
			$('.ui.standard.modal.airline.info').modal('show');
		}
	});
}
