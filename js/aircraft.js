var aircraftList = [];
var userAircraftObj;
var userAircraftListView;
var userAircraftList = [];
var userAircraft = {};
var selectedAircraft;
var seats;

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
		loadSeats();
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
function loadSeats() {
  $.getJSON(base + 'aircraft/seats' + cookies.url).done(function(data){
    seats = data;
    seats[1].sqft += 0.5;
    seats[3].sqft += 0.5;
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
		selectedAircraft = this.model;
		var variables = this.model.attributes;
		variables.maxFlights = changeAircraftQuantity(1000).quantity;
		if((variables.iata.match(/CR2|ERJ/gi))) {
			variables.config = getConfigSpecs({f:{p:0.0,i:6},j:{p:0.0,i:3},p:{p:0.0,i:1},y:{p:1.0,i:0}});
		} else if(variables.iata.match(/73|31|32[01]/gi)) {
			variables.config = getConfigSpecs({f:{p:0.0,i:7},j:{p:0.1,i:4},p:{p:0.2,i:1},y:{p:0.7,i:0}});
		} else {
			variables.config = getConfigSpecs({f:{p:0.12,i:8},j:{p:0.30,i:5},p:{p:0.14,i:2},y:{p:0.44,i:0}});
		}
		this.model.attributes = variables;
		var template = _.template($('#aircraftPurchaseTemplate').html(),variables);
		$('body').append(template);
		$('.row.config-row[data-rowtype="price"] .price').popup();
		$('.selection.dropdown').dropdown();
		$('.row.config-row[data-rowtype="quantity"] input[type="range"]').on('input change',function(){
			var quantity = changeAircraftQuantity($(this).val());
			$('.row.config-row[data-rowtype="quantity"] span').html(quantity.quantity);
			$('.row.config-row[data-rowtype="price"] .price').html('$' + comma(quantity.price) + ' ($' + comma(quantity.price*quantity.quantity) + ' total)');
		});
		$('.selection.dropdown[data-rowtype="configuration"] input').on('change',function(){
			var id = $(this).val();
			fillConfigDetails(id);
		});
		if(variables.user.configs.length > 0) {
			fillConfigDetails(variables.user.configs[0].id);
		}
		$('#aircraftPanel').modal('show');
	},
	loadAircraftConfigs:function(){
		alert('configs');
	},
	loadAircraftList:function(){
		var el = $('#list' + this.model.attributes.iata);
		var hidden = el.hasClass('hide')
		$('.aircraft.compressed').removeClass('show').addClass('hide');
		if(hidden) {
			el.removeClass('hide').addClass('show');
		}
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

function fillConfigDetails(id) {
	var config = JSON.parse($('[data-rowtype="configuration"] .item[data-value="' + id + '"]').data('json').replace(/\'/gi,"\""));
	$('.row.config-row[data-cabintype="f"] input[type="range"]').val(config.f.count).on('change input',function(){ changeConfiguration('f'); });
	$('.row.config-row[data-cabintype="j"] input[type="range"]').val(config.j.count).on('change input',function(){ changeConfiguration('j'); });
	$('.row.config-row[data-cabintype="p"] input[type="range"]').val(config.p.count).on('change input',function(){ changeConfiguration('p'); });
	$('.row.config-row[data-cabintype="y"] input[type="range"]').val(config.y.count).on('change input',function(){ changeConfiguration('y'); });
	_.each(['f','j','p','y'],function(cabin){ changeConfiguration(cabin); });
}
function getConfigSpecs(config) {
	var sqft = selectedAircraft.attributes.sqft;
	var configData = {def:{f:0,j:0,p:0,y:0},max:{f:0,j:0,p:0,y:0},layout:config};
	var sqftLeft = sqft;
	_.each(config,function(value,cabin){
		configData.max[cabin] = Math.floor(sqft/seats[value.i].sqft);
		if(cabin === 'y') {
			configData.def['y'] = Math.floor(sqftLeft/seats[value.i].sqft);
		} else {
			configData.def[cabin] = Math.floor((sqft*value.p)/seats[value.i].sqft);
			sqftLeft -= (configData.def[cabin]*seats[value.i].sqft);
		}
	});
	return configData;
}
function stringifyConfig(config) {
	var classes = [];
	config.f.count > 0 ? classes.push('F: ' + config.f.count) : '';
	config.j.count > 0 ? classes.push('J: ' + config.j.count) : '';
	config.p.count > 0 ? classes.push('P: ' + config.p.count) : '';
	config.y.count > 0 ? classes.push('Y: ' + config.y.count) : '';
	return ' (' + classes.join(' // ') + ')';
}
function changeConfiguration(cabinClass) {
  var aircraft = selectedAircraft;
  var availableSpace = selectedAircraft.attributes.sqft;
  _.each(selectedAircraft.attributes.config.layout,function(seat,cabin){
		console.log(availableSpace);
    var seat = seats[seat.i];
		if(cabin === 'f') {
			console.log(seat);
		}
    var row = $('.row[data-cabintype="' + cabin + '"]');
    var seatsVal = Math.max(Math.ceil(row.find('input[type="range"]').val()),0);
    var space = (seatsVal*seat.sqft);
    if(space > availableSpace) {
      seatsVal = Math.floor(availableSpace/seat.sqft);
      space = availableSpace;
    }
    if(key == "y") {
      if(space < availableSpace) {
        seatsVal = Math.floor(availableSpace/seat.sqft);
      }
    }
    row.find('span').html(seatsVal);
    row.find('input[type="range"]').val(seatsVal);
    availableSpace -= space;
  });
}
function setLayout() {
	var classType = {f:{name:"First",percent:12,id:9},j:{name:"Business",percent:23,id:6},p:{name:"Premium",percent:15,id:2},y:{name:"Economy",percent:50,id:1}};
	$.each(classType,function(key,value){
	  var seat = seats[value.id];
	  var seatsCount = ((value.percent*0.01*aircraft.sqft)/seat.sqft);
	  var seatsSpace = Math.ceil(seatsCount*seat.sqft);
	  var seatsVal = Math.ceil(Math.min(seatsCount,(availableSpace/seat.sqft)));
	  availableSpace -= (seatsVal*seat.sqft);
	  var seatsMax = Math.floor(aircraft.sqft/seat.sqft);
	  var classRow = '<div class="row config-row" data-cabintype="' + key + '">';
	  classRow += '<div class="ui checkbox" style="opacity:0;"><input type="checkbox"></div>';
	  classRow += '<div class="label">' + value.name + '</div>';
	  classRow += '<span>' + seatsVal + '</span>'
	  classRow += '<input type="range" value="' + seatsVal + '" min="0" max="' + seatsMax + '" />';
	  classRow += '</div>';
	  panel += classRow;
	});
}
function changeAircraftQuantity(quantity) {
	var selection = selectedAircraft.attributes;
  var discount = Math.min(((quantity-1)*selection.discount),50);
  var price = Math.round(selection.price*(1-(discount*0.01)));
  var maxPlanes = Math.floor(airline.money/price);
  if(quantity > maxPlanes) {
    quantity = maxPlanes;
  }
  return {quantity:quantity,price:price,discount:discount};
}