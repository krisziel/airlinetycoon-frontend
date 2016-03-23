var Notification = Backbone.Model.extend({
	initialize:function(){}
});
var NotificationList = Backbone.Collection.extend({
	model:Notification
});
var NotificationView = Backbone.View.extend({
  initialize:function(){
    this.render();
  },
  render:function(){
    var variables = this.model.attributes;
    if((variables)&&(variables.id)) {
			$('#notifications').css({ display:'block', opacity:1 });
      var template = _.template($('#notificationItemTemplate').html(), variables);
      $("#notifications").prepend(template);
			setTimeout(function(){ $('.notification[data-id="' + variables.id + '"]').css({ opacity:0, height:0 }).delay(500).remove(); }, 7500);
    }
  }
});
function openNotification(id) {
	var model = notificationList.get(id).attributes;
	if(model.type == "Route") {
	  showRoute(model.typeId);
	}
}
