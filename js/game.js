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
    if(variables.name) {
	    var template = _.template($('#gameTemplate').html(),variables);
	    this.$el.html(template);
	    return this;
    } else if(variables.game) {
    	this.selectGame(this.model);
    }
  },
	events:{
		'click .game.button.green':'selectGame',
		'click .game.button.blue':'loadGame'
	},
	selectGame:function(){
		var id = this.model.attributes.id;
		if(this.model.attributes.player) {
			this.loadGame();
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
	},
	loadGame:function(){
		var id = this.model.attributes.id;
		loadGame(id);
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
		var template = _.template($('#newAirlineTemplate').html(),{id:id});
    this.$el.append(template);
	},
	events:{
		'blur input[name="[airline]name"]':'checkName',
		'blur input[name="[airline]icao"]':'checkIcao',
		'click .button.create':'createAirline'
	},
	createAirline:function(){
		var icao = $('input[name="[airline]icao"]');
		var name = $('input[name="[airline]name"]').val();
		if((icao.attr('data-content') === '')&&(name.length > 0)) {
			$.post(base + 'airline/' + cookies.url,$('#newAirline').serialize()).done(function(data){
				if(data.name) {
					loginErrorHandler({inputName:'[airline]name',fieldName:'',value:data.name});
				}
				if(data.icao) {
					loginErrorHandler({inputName:'[airline]icao',fieldName:'',value:data.icao});
				}
				if(data.cookie) {
					setCookie({key:'game_id',value:data.cookie});
					parseCookie();
					loadGame(this.model.attributes.id);
				}
			});
		}
	},
	checkIcao:function(e){
		var icao = $(e.currentTarget);
		if(icao.val().length !== 3) {
			icao.attr('data-content','Airline code must be 3 letters').popup('show');
			icao.parent().find('.button').removeClass('green');
		} else if(!icao.val().match(/[A-Za-z]{3}/)) {
			icao.attr('data-content','Airline code can only have letters').popup('show');
			icao.parent().find('.button').removeClass('green');
		} else {
			icao.attr('data-content','').popup('destroy');
			if($('input[name="[airline]name"]').attr('data-content') === '') {
				icao.parent().removeClass('error');
				icao.parent().find('.button').addClass('green');
			}
		}
	},
	checkName:function(e){
		var name = $(e.currentTarget);
		if(name.val().length < 5) {
			name.attr('data-content','Airline name must be at least 5 characters').popup('show');
			name.parent().find('.button').removeClass('green');
		} else if(!name.val().match(/\w+/)) {
			name.attr('data-content','Airline name can only have letters and numbers').popup('show');
			name.parent().find('.button').removeClass('green');
		} else {
			name.attr('data-content','').popup('destroy');
			if($('input[name="[airline]icao"]').attr('data-content') === '') {
				name.parent().removeClass('error');
				name.parent().find('.button').addClass('green');
			}
		}
	}
})

var games = [];
var gameList;
function loadGames() {
	$.getJSON(base + 'game' + cookies.url).done(function(data){
		if(data[data.length-1].game) {
			loadGame(data[data.length-1].gameid);
		} else {
			$('.login-window').modal('hide');
			$('.game-window').modal({closable:false}).modal('show');
		  _.each(data,function(game){
		    gameItem = new Game(game);
				games.push(gameItem);
			});
		  gameList = new GameList(games);
		  new GameListView({el:'#gameList'});
		}
	});
}
