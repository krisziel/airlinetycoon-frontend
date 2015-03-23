function launchGame(id) {
	$('.game-window').modal('hide');
	loadGame(id);
	loadAirports();
	loadFlights();
	loadAircraft();
	loadAlliance();
	loadMore();
	loadMsc();
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
function loadMsc() {
	$('body').on('keyup','textarea',function(){
		$(this).css('height','auto');
		$(this).height(this.scrollHeight-20);
	});
	$('body').on('click','.ui.button.blue.super.small',function(e){
		e.preventDefault();
		sendChatMessage();
	});
	launchChat();
}