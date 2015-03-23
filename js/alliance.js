var Alliance = Backbone.Model.extend({
	
});
var AllianceList = Backbone.Collection.extend({
	model:Alliance
})
var AllianceView = Backbone.View.extend({
	initialize:function(){
		this.render();
	},
	render:function(){
		
	}
});
var AllianceListView = Backbone.View.extend({
	initialize:function(){
		this.render();
	},
	render:function(){
		
	}
});
var AllianceAirline = Backbone.View.extend({
	initialize:function(){
		this.render();
	},
	render:function(){
		
	}
});

var AllianceChatView = Backbone.View.extend({
  initialize:function(){
		console.log('alliance chat view');
    this.render();
  },
  render:function(){
		console.log('alliance chat render');
    this.addAll();
  },
  addOne:function(){
		console.log('alliance chat one');
    var view = new AllianceMessageView();
    this.$el.append(view.$el);
  },
  addAll:function(){
		console.log('alliance chat all');
    var view = new AllianceMessageView();
    this.$el.html(view.$el);
  }
});
var AllianceMessageView = Backbone.View.extend({
  initialize:function(){
		console.log('dafuq');
    this.render();
  },
  render:function(){
    var template = _.template($('#allianceMessageTemplate').html());
    this.$el.html(template);
		console.log(this);
    return this;
  }
});