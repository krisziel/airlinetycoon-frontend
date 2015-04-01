var base = 'http://localhost:3000/'

var Airport = Backbone.Model.extend({
  initialize:function(){
		this.on("change:name",function(model){
			console.log("new equipment " + this.get('name'));
		});
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
	});
}
function loadAirport(e) {
	console.log(e);
}