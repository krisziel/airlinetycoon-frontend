var allianceAirlineList;
var allianceView;
var alliance = {};
var alliances = [];

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
		launchChat();
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
var AllianceAirlineView = Backbone.View.extend({
  initialize:function(){
    this.render();
  },
  render:function(){
    var variables = this.model.attributes;
    var template = _.template($('#allianceAirlineTemplate').html(),variables);
    this.$el.html(template);
    return this;
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
  }
});