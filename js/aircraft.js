var userAircraftListView;
var userAircraftList = [];

function loadUserAircraft() {
	$.getJSON(base + 'aircraft/user' + cookies.url).done(function(data){
		$('#aircraftList').css({height:$(window).height()-35});
		_.each(data,function(aircraft){
			userAircraftList.push(new UserAircraft(aircraft));
		});
		userAircraftList = new AircraftList(userAircraftList);
		userAircraftListView = new UserAircraftListView({el:'#aircraftList'});
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
		var template = _.template($('#userAircraftTemplate').html(),variables);
		this.$el.html(template);
		return this;
	},
	events:{
		'click .header.aircraft':'loadAircraftInfo'
	},
	loadAircraftInfo:function(e){
		
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
		var view = new AircraftView({model:flight});
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
