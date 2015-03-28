var aircraftList = [];
var userAircraftObj;
var userAircraftListView;
var userAircraftList = [];
var userAircraft = {};

function loadAircraft() {
	$.getJSON(base + 'aircraft' + cookies.url).done(function(data){
		var inuse = [];
		var unused = [];
		_.each(data,function(aircraft){
			var userAircrafts = [];
			_.each(aircraft.user.aircraft,function(thisAircraftId){
				var thisAircraft = userAircraft[thisAircraftId];
				if(thisAircraft.flight) {
					aircraft.user.inuse++;
				} else {
					aircraft.user.unused++;
				}
				userAircrafts.push(new UserAircraft(thisAircraft));
			});
			aircraft.user.aircraft = new UserAircraftList(userAircrafts);
			if((aircraft.user.inuse > 0)||(aircraft.user.unused > 0)) {
				inuse.push(new Aircraft(aircraft));
			} else {
				unused.push(new Aircraft(aircraft));
			}
		});
		aircraftList = inuse.concat(unused);
		aircraftList = new AircraftList(aircraftList);
		aircraftListView = new AircraftListView({el:'#aircraftList'});
	});
}

function loadUserAircraft() {
	$.getJSON(base + 'aircraft/user' + cookies.url).done(function(data){
		userAircraft = data;
		loadAircraft();
		$('#aircraftList').css({height:$(window).height()-35});
		_.each(data,function(aircraft){
			userAircraftList.push(new UserAircraft(aircraft));
		});
		userAircraftList = new UserAircraftList(userAircraftList);
		//userAircraftListView = new UserAircraftListView({el:'#aircraftList'});
	});
}

var Aircraft = Backbone.Model.extend({
	
});
var AircraftList = Backbone.Collection.extend({
	model:Aircraft
});
var AircraftView = Backbone.View.extend({
	initialize:function(){
		this.render();
		this.listenTo(aircraftList,'add',this.addOne);
	},
	render:function(){
		var variables = this.model.attributes;
		var template = _.template($('#aircraftTemplate').html(),variables);
		this.$el.html(template);
		return this;
	},
	events:{
		'click .aircraft:not(.flight)':'checkAircraft'
	},
	checkAircraft:function(e){
		var el = $(e.currentTarget);
		e.stopPropagation();
		if(el.hasClass('purchase')) {
			this.loadAircraftPurchase();
		} else if(el.hasClass('configs')) {
			this.loadAircraftConfigs();
		} else {
			this.loadAircraftList();
		}
	},
	loadAircraftPurchase:function(){
		alert('purchase');
	},
	loadAircraftConfigs:function(){
		alert('configs');
	},
	loadAircraftList:function(){
		alert('list');
	}
});
var AircraftListView = Backbone.View.extend({
	initialize:function(){
		this.render();
		this.listenTo(aircraftList,'add',this.addOne);
	},
	render:function(){
		this.addAll();
	},
	addOne:function(aircraft){
		var view = new AircraftView({model:aircraft});
    this.$el.append(view.$el);
	},
	addAll:function(){
		this.$el.html('');
		aircraftList.each(this.addOne,this);
	}
});
var AircraftInfoView = Backbone.View.extend({
	
});

var UserAircraft = Backbone.Model.extend({
	
});
var UserAircraftList = Backbone.Collection.extend({
	model:UserAircraft
});
var UserAircraftView = Backbone.View.extend({
	initialize:function(){
		this.render();
	},
	render:function(){
		var variables = this.model.attributes;
		var template = _.template($('#userAircraftTemplate').html(),variables);
		this.$el.html(template);
		return this;
	},
	events:{
		'click .airport.compressed.header':'loadPlaneInfo'
	},
	loadPlaneInfo:function(){
		alert(this.model);
	}
});
var UserAircraftListView = Backbone.View.extend({
	initialize:function(){
		this.render();
		this.listenTo(userAircraftList,'add',this.addOne);
	},
	render:function(){
		this.addAll();
	},
	addOne:function(userAircraft){
		var view = new UserAircraftView({model:userAircraft});
		this.$el.append(view.$el);
	},
	addAll:function(){
		this.$el.html('');
		userAircraftList.each(this.addOne,this);
	}
});
