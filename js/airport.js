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
	loadAirport:function(){
		console.log(this.model.attributes.id);
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
    this.$el.html('');
    airportList.each(this.addOne,this);
  }
});

var airports = [];
var airportList;
function loadAirports(){
	$.getJSON(base + 'airport').done(function(data){
	  _.each(data,function(airport){
	    airportItem = new Airport(airport);
	    airports.push(airportItem);
		});
	  airportList = new AirportList(airports);
	  new AirportListView({el:'#airportList'});
	});
}
var ROR = $.parseJSON('{"iata": "ROR","cityCode": "ROR","name": "Airai Airport","city": "Koror","state": null,"country": "Palau","population": 500000,"slots": {"total": 1989,"available": 1213},"coordinates": {"latitude": "7.364122","longitude": "134.532892"},"id": 9}');