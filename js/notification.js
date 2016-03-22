var Notification = Backbone.Model.extend({
	initialize:function(){}
});

var NotificationList = Backbone.Collection.extend({
	model:Notification,
  add:function(notification){
    new NotificationView({ model:notification });
  }
});

var NotificationView = Backbone.View.extend({
  initialize:function(){
    this.render();
  },
  render:function(){
    var variables = this.model.attributes;
		variables.header = "New airline entrant";
    if(variables.id) {
      var template = _.template($('#notificationItemTemplate').html(), variables);
      $("#notifications").prepend(template);
    }
  },
	events:{
		'click':'openNotification'
	},
	openNotification:function(e){
		console.log(e);
		var model = this.model.attributes;
    if(model.notificationable_type == "Route") {
      showRoute(model.route_id, model.flight_id);
    }
	}
});
