function launchGame(id) {
  $('.game-window').modal('hide');
  sizeMap();
  loadMap();
  loadAirports(); // loadFlights moved to loadAirports in leiu of promise for it to complete
  loadUserAircraft();
  loadMsc();
  connect();
  var menu = new MenuView({el:'#leftColumn'});
  $('#leftColumn').css({display:'block'}).find('.column').css({height:$('#leftColumn').height()-35});
  loadMore();
}
var MenuView = Backbone.View.extend({
  initialize:function(){
    this.render();
  },
  render:function(){
    var template = _.template($('#menuTemplate').html());
    this.$el.html(template);
  },
  events:{
    'click .item[data-tabid]':'selectTab'
  },
  selectTab:function(e) {
    closeChat();
    var tab = $(e.currentTarget);
    var tabid = tab.data('tabid');
    prepareTab(tabid);
    tab.parent().children('.item').removeClass('active');
    tab.addClass('active');
    $('*:not(.item)[data-tabid]').css({display:'none'});
    $('*:not(.item)[data-tabid=' + tabid + ']').css({display:'block'});
  }
});
function loadGame(id) {
  $.getJSON(base + 'game/' + id + cookies.url).done(function(data){
    airline = data.own;
    setCookie({key:'game_id',value:data.cookie});
    launchGame();
    return false;
  });
}
function loadMore() {
  var template = _.template($('#moreColumnTemplate').html());
  $('#moreList').html(template);
  $('#moreList').on('click','.logout',function(){
    logout();
  });
}
function loadMsc() {
  $('body').on('keyup','textarea',function(){
    $(this).css('height','auto');
    $(this).height(this.scrollHeight-20);
  });
}
function prepareTab(tab) {
  if(tab === 'alliance') {
    loadAlliance();
  }
}