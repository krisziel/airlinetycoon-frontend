var Game = Backbone.Model.extend({
	initialize:function(){}
});

var GameList = Backbone.Collection.extend({
	model:Game
});

var GameView = Backbone.View.extend({
  initialize:function(){
    this.render();
  },
  render:function(){
    var variables = this.model.attributes;
    var template = _.template($('#gameTemplate').html(),variables);
    this.$el.html(template);
    return this;
  }
});

var GameListView = Backbone.View.extend({
  initialize:function(){
    this.render();
    this.listenTo(gameList, 'add', this.addOne);
  },
  render:function(){
    this.addAll();
  },
  addOne:function(game){
    var view = new GameView({model: game});
    this.$el.append(view.$el);
  },
  addAll:function(){
    this.$el.html('');
    gameList.each(this.addOne,this);
  }
});
var games = [];
var gameList;
$.getJSON(base + 'game').done(function(data){
  _.each(data,function(game){
    gameItem = new Game(game);
    // if(!_.include(airportList,airportItem)) {
      games.push(gameItem);
			// }
		});
  gameList = new GameList(games);
  new GameListView({el:'#gameList'});
});