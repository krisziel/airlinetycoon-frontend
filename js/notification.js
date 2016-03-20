var Notification = Backbone.Model.extend({
	initialize:function(){}
});

var NotificationList = Backbone.Collection.extend({
	model:Notification,
  add:function(notification){
    new NotificationView({model:notification});
  }
});

var NotificationView = Backbone.View.extend({
  initialize:function(){
    this.render();
  },
  render:function(){
    var variables = this.model.attributes;
    if(variables.id) {
      var template = _.template($('#notificationItemTemplate').html(),variables);
      $("#notifications").prepend(template);
    }
  },
	events:{
		'click .close':'closeNotification',
		'click .open':'openNotification'
	},
	openNotification:function(){
		var model = this.model.attributes;
    if(model.notificationable_type == "Route") {
      showRoute(model.route_id, model.flight_id);
    }
	},
	closeNotification:function(){
		var id = this.model.attributes.id;
		$('#notification' + id).css({ opacity:0 }).delay(500).css({ display:'none' });
	}
});
