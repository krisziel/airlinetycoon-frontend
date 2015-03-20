var base = 'http://localhost:3000/'

var Flight = Backbone.Model.extend({
  initialize:function(){
    this.on("change:equipment",function(model){
      console.log("new equipment " + this.get('equipment'));
    });
  },
  equipmentSwap:function(newEquipment){
    this.set({equipment:newEquipment});
  }
});

var FlightList = Backbone.Collection.extend({
  model:Flight
});

var FlightView = Backbone.View.extend({
  initialize:function(){
    this.render();
    this.listenTo(this.model, 'change', this.render);
  },
  events:{
    'click .edit':'editFlight',
    'click .save':'saveFlight'
  },
  render:function(){
    var variables = this.model.attributes;
    var template = _.template($('#flightTemplate').html(),variables);
    this.$el.html(template);
    return this;
  },
  editFlight:function(){
    console.log(this);
  },
  saveFlight:function(){

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
    this.$el.html('');
    flightList.each(this.addOne,this);
  }
});

var flightOne = new Flight({ airline:'United', flightNumber:'001', equipment:'787-9', origin:'SFO', destination:'CTU' });
var flightTwo = new Flight({ airline:'Southworst', flightNumber:'001', equipment:'737-700', origin:'OAK', destination:'DEN' });
var flightList = new FlightList([flightOne, flightTwo]);

new FlightListView({el:'#flightsList'});

$.getJSON(base + 'airport').done(function(data){
	var airports = data;
	var airportModel = new Airport(airports);
	console.log(airportModel);
});


var Airport = Backbone.Model.extend({
	initialize:function(){
		
	}
});

var airportList = Backbone.Collection.extend({
	model:Airport
});

var AirportView = Backbone.View.extend({
  initialize:function(){
    this.render();
    this.listenTo(this.model, 'change', this.render);
  },
  /*events:{
    'click .edit':'editFlight',
    'click .save':'saveFlight'
  },*/
  render:function(){
    var variables = this.model.attributes;
    var template = _.template($('#airportTemplate').html(),variables);
    this.$el.html(template);
    return this;
  },
});

var AirportListView = Backbone.View.extend({
  initialize:function(){
    this.render();
    this.listenTo(flightList, 'add', this.addOne);
  },
  render:function(){
    this.addAll();
  },
  addAll:function(){
    this.$el.html('');
    flightList.each(this.addOne,this);
  }
});

new AirportListView({el:'#airportList'});
