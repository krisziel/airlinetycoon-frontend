var allianceAirlineList;
var allianceView;
var alliance = {};
var allianceList = [];

function loadAlliance() {
	loadAllianceAirlines();
	$('#allianceList').on('click','.item[data-tab]',function(e){
		var tab = $(e.currentTarget);
		$('#allianceList .item[data-tab]').removeClass('active');
		$('#allianceList .item[data-tab=' + tab.attr('data-tab') + ']').addClass('active');
		$('#allianceList > div[data-tab]').css({display:'none'});
		$('#allianceList > div[data-tab=' + tab.attr('data-tab') + ']').css({display:'block'});
	});
}
function loadAllianceAirlines(id) {
	var id = id || 'own';
	$.getJSON(base + 'alliance/' + id + cookies.url).done(function(data){
		if(data.error) {
			loadAllianceList();
		} else {
			alliance = data;
			var allianceAirlines = [];
			_.each(data.airlines,function(airline){
				var allianceAirlineItem = new AllianceAirline(airline);
				allianceAirlines.push(allianceAirlineItem);
			});
			alliance.airlines = allianceAirlines;
			alliance = new Alliance(alliance);
			new AllianceInfoView({el:'#allianceList',model:alliance});
			$('.chat.window').css({height:$('#leftColumn').height()-115});
			//launchChat();
		}
	});
}
function loadAllianceList() {
	$.getJSON(base + 'alliance' + cookies.url).done(function(data){
		allianceList = [];
		_.each(data,function(alliance){
			var allianceItem = new Alliance(alliance);
			allianceList.push(allianceItem);
		});
		allianceList = new AllianceList(allianceList);
		new AllianceListView({el:'#allianceList',model:allianceList});
	});
}

///// backbone

var Alliance = Backbone.Model.extend({
  initialize:function(){
  }
});
var AllianceAirline = Backbone.Model.extend({
  initialize:function(){
  }
});
var AllianceAirlineList = Backbone.Collection.extend({
  model:AllianceAirline
});
var AllianceList = Backbone.Collection.extend({
	model:Alliance
});
var AllianceAirlineView = Backbone.View.extend({
  initialize:function(){
    this.render();
  },
  render:function(){
    var variables = this.model.attributes;
		variables.admin = alliance.attributes.admin;
    var template = _.template($('#allianceAirlineTemplate').html(),variables);
    this.$el.html(template);
    return this;
  },
	testing:function(){
		alert('testing');
	}
});
var AllianceView = Backbone.View.extend({
  initialize:function(){
    this.render();
  },
  render:function(){
    var variables = this.model.attributes;
    var template = _.template($('#allianceTemplate').html(),variables);
    this.$el.html(template);
    return this;
  }
});
var AllianceListView = Backbone.View.extend({
	initialize:function(){
		this.render();
	},
  render:function(){
    this.addAll();
  },
  addOne:function(alliance){
    var view = new AllianceView({model: alliance});
    this.$el.append(view.$el);
  },
  addAll:function(){
    this.$el.html('');
    allianceList.each(this.addOne,this);
  }
});
var AllianceAirlineListView = Backbone.View.extend({
  initialize:function(){
    this.render();
  },
  render:function(){
    this.addAll();
  },
  addOne:function(alliance){
    var view = new AllianceAirlineView({model: alliance});
    this.$el.append(view.$el);
  },
  addAll:function(){
    this.$el.html('');
    allianceAirlineList.each(this.addOne,this);
  },
	testing:function(e){
		alert('dafuq');
	}
});
var AllianceInfoView = Backbone.View.extend({
  initialize:function(){
    this.render();
  },
  render:function(){
		allianceAirlines = function(airlines){
		  allianceAirlineList = new AllianceAirlineList(airlines);
		  return new AllianceAirlineListView().$el.html();
		}
    var variables = this.model.attributes;
		variables.pending = 0;
		_.each(variables.airlines,function(airline){
			if(!airline.attributes.status) {
				variables.pending++;
			}
		});
    var template = _.template($('#allianceInfoTemplate').html(),variables);
    this.$el.html(template);
    return this;
  },
	events:{
		'click .ui.button.red.micro.alliance.airline.eject':'ejectAllianceAirline',
		'click .ui.button.red.micro.alliance.airline.reject':'rejectAllianceAirline',
		'click .ui.button.green.micro.alliance.airline.accept':'approveAllianceAirline'
	},
	ejectAllianceAirline:function(e){
		var airline = $(e.currentTarget).closest('.dividing.header');
		$.post(base + 'alliance/' + this.model.attributes.id + '/eject' + cookies.url + '&membership_id=' + airline.data('membership')).done(function(data){
			if(data.airline) {
				airline.remove();
			} else {
				
			}
		});
	},
	rejectAllianceAirline:function(e){
		var airline = $(e.currentTarget).closest('.dividing.header');
		$.post(base + 'alliance/' + this.model.attributes.id + '/reject' + cookies.url + '&membership_id=' + airline.data('membership')).done(function(data){
			if(data.airline) {
				airline.remove();
			} else {
				
			}
		});
	},
	approveAllianceAirline:function(e){
		var airline = $(e.currentTarget).closest('.dividing.header');
		$.post(base + 'alliance/' + this.model.attributes.id + '/approve' + cookies.url + '&membership_id=' + airline.data('membership')).done(function(data){
			if(data.airline) {
				airline.find('.airport.alliance.data div').remove();
				airline.find('.airport.alliance.data').append('<div class="ui button red micro alliance airline eject">Eject</div>');
			} else {
				
			}
		});
	}
});
