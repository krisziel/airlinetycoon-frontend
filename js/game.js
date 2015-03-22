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
  	plural = function(number, word){
			return number === 1 ? number + ' ' + word : number + ' ' + word + 's';
		}
    var variables = this.model.attributes;
    var template = _.template($('#gameTemplate').html(),variables);
    this.$el.html(template);
    return this;
  },
	events:{
		'click .game.button:eq(0)':'selectGame'
	},
	selectGame:function(){
		var id = this.model.attributes.id;
		if(this.model.attributes.player) {
			loadGame(id);
		} else {
			if($('#game' + id).find('.button').hasClass('red')) {
				$('#game' + id).css({height:57}).find('.button:eq(0)').html('Join Game').removeClass('red');
				var removeAirline = _.bind(function(){ $('#game' + id).find('.new.airline').remove(); });
				_.delay(removeAirline, 400);
			} else {
				$('#game' + id).css({height: 99}).find('.button').html('Cancel').addClass('red');
				new NewAirlineView({el:'#game' + id,id:id});
			}
		}
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

var NewAirlineView = Backbone.View.extend({
	initialize:function(id){
		this.render(id.id);
	},
	render:function(id){
		id 
		var template = _.template($('#newAirlineTemplate').html(),{id:id});
    this.$el.append(template);
	},
	events:{
		'blur input[maxlength="3"]':'checkIcao',
		'click .button.green.create':'createAirline'
	},
	createAirline:function(){
		$.post(base + 'airline/',$('#newAirline').serialize()).done(function(data){
			console.log(data)
		});
	},
	checkIcao:function(e){
		var icao = $(e.currentTarget);
		if(icao.val().length !== 3) {
			$(icao.parent().addClass('error'));
		}
	}
})

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