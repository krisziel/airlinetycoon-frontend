function launchGame(id) {
	console.log(id);
	$('.game-window').modal('hide');
	loadGame(id);
	loadAirports();
	loadFlights();
	loadAircraft();
	loadAlliance();
	loadMore();
	var menu = new MenuView({el:'#leftColumn'});
}
var MenuView = Backbone.View.extend({
	initialize:function(){
		this.render();
	},
	render:function(){
		var template = _.template($('#menuTemplate').html());
    this.$el.append(template);
	},
	events:{
		'click .item[data-tabid]':'selectTab'
	},
	selectTab:function(e) {
		var tab = $(e.currentTarget);
		var tabid = tab.data('tabid');
		tab.parent().children('.item').removeClass('active');
		tab.addClass('active');
	}
});
function loadGame(id) {
	$.getJSON(base + 'game/' + id + cookies.url).done(function(data){
		setCookie({key:'game_id',value:data.cookie});
	});
}
function loadFlights() {
	
}
function loadAircraft() {
	
}
function loadAlliance() {
	
}
function loadMore() {
	
}