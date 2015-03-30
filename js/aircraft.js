var aircraftList = [];
var userAircraftObj;
var userAircraftListView;
var userAircraftList = [];
var userAircraft = {};
var selectedAircraft;
var seats;

function loadAircraft() {
	$.getJSON(base + 'aircraft' + cookies.url).done(function(data){
		var inuse = []; // array of used aircraft
		var unused = []; // array of unused aircraft
		_.each(data,function(aircraft){ // for every aircraft type (777-300ER, 777-200LR, etc)
			var userAircrafts = []; // empty array to hold all of the user's aircraft of this type
			_.each(aircraft.user.aircraft,function(thisAircraftId){ // for each aircraft id in the list of user aircraft
				var thisAircraft = userAircraft[thisAircraftId]; // set this aircraft to the actualy user aircraft pulled from loadUserAircraft
				if(thisAircraft.flight) { // if it has a flight it is in use
					aircraft.user.inuse++;
				} else {
					aircraft.user.unused++;
				}
				userAircrafts.push(new UserAircraft(thisAircraft)); // Push the aircraft into the user aircraft array
			});
			aircraft.user.aircraft = new UserAircraftList(userAircrafts); // set this aircraft's list of user aircraft to be this list
			if((aircraft.user.inuse > 0)||(aircraft.user.unused > 0)) { // if the airline owns at least one aircraft
				inuse.push(new Aircraft(aircraft)); // put it in the inuse array so it is at the top of the list
			} else {
				unused.push(new Aircraft(aircraft)); // otherwise it isnt at the top of the list
			}
		});
		aircraftList = inuse.concat(unused); // combine the two lists
		aircraftList = new AircraftList(aircraftList); // create an AircraftList from the list
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
	model:Aircraft,
	search: function(query, callback){
		var collection = this;
		var result;
		collection.find(function(model) {
			var key = Object.keys(query)[0];
			if(model.get(key) === query[key]) {
				result = model;
			}
		});
		return result;
	}
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
		var template = _.template($('#aircraftPurchaseModalTemplate').html());
		if($('.route-panel').length > 0) {
		} else {
			$('body').append(template);
			$('.aircraft-list.vertical').on('click','.step.own',function(e){
				selectedAircraft = aircraftList.search({id:$(e.currentTarget).data('aircraftid')});
				showPurchaseModal();
			});
		}
		showPurchaseModal();
	},
	loadAircraftList:function(){
		var el = $('#list' + this.get(iata));
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
function showPurchaseModal() {
	var variables = selectedAircraft.attributes;
	selectedAircraft.set('maxFlights',changeAircraftQuantity(1000).quantity);
	if((selectedAircraft.get('iata').match(/CR2|ERJ/gi))) {
		selectedAircraft.set('config',getConfigSpecs({f:{p:0.0,i:6},j:{p:0.0,i:3},p:{p:0.0,i:1},y:{p:1.0,i:0}}));
	} else if(selectedAircraft.get('iata').match(/73|31|32[01]/gi)) {
		selectedAircraft.set('config',getConfigSpecs({f:{p:0.0,i:7},j:{p:0.1,i:4},p:{p:0.2,i:1},y:{p:0.7,i:0}}));
	} else {
		selectedAircraft.set('config',getConfigSpecs({f:{p:0.12,i:8},j:{p:0.30,i:5},p:{p:0.14,i:2},y:{p:0.44,i:0}}));
	}
	console.log(selectedAircraft.get('config'));
	selectedAircraft.attributes = variables;
	var template = _.template($('#aircraftPurchaseTemplate').html(),variables);
	$('.aircraft-info').html(template);
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
	$('#saveConfiguration').on('click',function(){
		if($(this).hasClass('blue')) {
			saveConfiguration();
		}
	});
	$('#purchaseButton').on('click',function(){
		purchaseAircraft();
	});
	$('.row.config-row[data-cabintype] input[type="range"]').on('change input',function(){ changeConfiguration($(this).data('data-cabintype')); });
	if(variables.user.configs.length > 0) {
		fillConfigDetails(variables.user.configs[0].id);
	} else {
		$('#saveConfiguration').removeClass('gray').addClass('blue');
	}
	$('.step.own[data-aircraftid]').removeClass('active');
	$('#aircraft' + variables.id).addClass('active');
	$('.fleet-info').css({marginLeft:0});
	changeConfiguration();
	$('#aircraftPanel').modal('show');
}
function fillConfigDetails(id) {
	var configData = $('[data-rowtype="configuration"] .item[data-value="' + id + '"]');
	var name = configData.html().split(' (')[0];
	var config = JSON.parse(configData.data('json').replace(/\'/gi,"\""));
	$('.row.config-row[data-cabintype="f"] input[type="range"]').val(config.f.count);
	$('.row.config-row[data-cabintype="j"] input[type="range"]').val(config.j.count);
	$('.row.config-row[data-cabintype="p"] input[type="range"]').val(config.p.count);
	$('.row.config-row[data-cabintype="y"] input[type="range"]').val(config.y.count);
	_.each(['f','j','p','y'],function(cabin){ changeConfiguration(cabin); });
	$('#configurationName').val(name).parent().find('.button').removeClass('blue').addClass('gray');
}
function getConfigSpecs(config) {
	var sqft = selectedAircraft.get('sqft');
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
function saveConfiguration() {
	var config = selectedAircraft.get('config').layout;
	var name = $('#configurationName');
	var nameArray = _.map(selectedAircraft.get('user').configs,function(cfg){ return cfg.name });
	if(name.val() === '') {
		name.attr('data-html','The configuration must have a name').popup('show').parent().addClass('error');
		return false;
	} else if(nameArray.indexOf(name.val()) >= 0) {
		name.attr('data-html','There is already a configuration with that name').popup('show').parent().addClass('error');
		return false;
	} else {
		name.attr('data-html','').popup('hide').parent().removeClass('error');
	}
	var aircraft_id = selectedAircraft.get('id');
	var configData = {
		name:name.val(),
		aircraft_id:aircraft_id,
		seats:{
			count:{
				f:$('.row.config-row[data-cabintype="f"] input[type="range"]').val(),
				j:$('.row.config-row[data-cabintype="j"] input[type="range"]').val(),
				p:$('.row.config-row[data-cabintype="p"] input[type="range"]').val(),
				y:$('.row.config-row[data-cabintype="y"] input[type="range"]').val()
			},
			id:{
				f:(config.f.i+1),
				j:(config.j.i+1),
				p:(config.p.i+1),
				y:(config.y.i+1)
			}
		}
	}
	$.post(base + 'aircraft/configs' + cookies.url,{config:configData}).done(function(data){
		if(data.name.constructor === Array) {
			name.attr('data-html',data.name[0]).popup('show').parent().addClass('error');
			return false;
		} else {
			var updatedUser = selectedAircraft.get('user');
			updatedUser.configs.push(data);
			selectedAircraft.set('user',updatedUser);
			$('#configurationId').val(data.id);
			$('#saveConfiguration').removeClass('blue').addClass('gray');
			return true;
		}
	});
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
  var availableSpace = selectedAircraft.get('sqft');
  _.each(selectedAircraft.get('config').layout,function(seat,cabin){
    var seat = seats[seat.i];
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
	$('#configurationName').val('').parent().find('.button').removeClass('gray').addClass('blue');
}
function changeAircraftQuantity(quantity) {
  var discount = Math.min(((quantity-1)*selectedAircraft.get('discount')),50);
  var price = Math.round(selectedAircraft.get('price')*(1-(discount*0.01)));
  var maxPlanes = Math.floor(airline.money/price);
  if(quantity > maxPlanes) {
    quantity = maxPlanes;
  }
  return {quantity:quantity,price:price,discount:discount};
}
function purchaseAircraft() {
	if($('.ui.action.left.input.configuration .button').hasClass('gray')) {
		
	} else {
		if(saveConfiguration()) {
			
		} else {
			console.log('error purchasing aircraft');
			return false;
		}
	}
	var aircraft_id = selectedAircraft.id;
	var configuration_id = $('#configurationId').val();
	var quantity = $('.row.config-row[data-rowtype="quantity"] input[type="range"]').val();
	var purchaseData = {aircraft_id:aircraft_id,configuration_id:configuration_id,quantity:quantity};
	$.post(base + 'aircraft/user' + cookies.url,purchaseData).done(function(data){
		if(data.length > 0) {
			var updatedUser = selectedAircraft.get('user');
			_.each(data,function(aircraft){
				updatedUser.aircraft.models.push(new UserAircraft(aircraft));
				userAircraft[aircraft.id] = new UserAircraft(aircraft);
			});
			updatedUser.unused += data.length;
			selectedAircraft.set('user',updatedUser);
		} else {
			
		}
	});
}