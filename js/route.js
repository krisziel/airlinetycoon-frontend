var routeList = {}
var selectedRoute;

function showRoute(id) {
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
		var routeView = new RouteView({model:selectedRoute});
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
		console.log(variables);
    var template = _.template($('#routeModalTemplate').html(),variables);
		$('.route-panel').html(template);
  }
});
var RouteFlightView = Backbone.View.extend({
  initialize:function(){
    this.render();
  },
  render:function(){
    var variables = this.model.attributes;
    var template = _.template($('#routeModalTemplate').html(),variables);
		$('.route-panel').html(template);
  }
});