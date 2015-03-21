$(document).ready(function(){
	startApp();
});
function startApp() {
	$.post(base + '/user/autologin', {}, function(data, textStatus) {
		if(data.status !== 'loggedin') {
			//$('.login-window').modal('show');
			$('.game-window').modal('show');
			activateLogin();
		}
	}, "json");
}
var button;
function activateLogin() {
	$('#loginMenu').on('click','.item',function(e){
		$(this).parent().find('.item').removeClass('active');
		$('.login-form form').css({display:'none'});
		$(this).addClass('active');
		$('*[data-tab="' + $(this).data('tab') + '"]:not(.item)').css({display:'block'});
	});
	$('input[name="[user]email"]').on('blur',function(){
		console.log($(this).val());
		if(!validEmail($(this).val())) {
			$('input[name="[user]email"]:eq(0)').attr('data-content','Please enter a valid email').popup({
				on:'focus',
		    position : 'bottom left',
				}).parent().addClass('error');
		} else {
			$('input[name="[user]email"]').popup('destroy').parent().removeClass('error');
		}
	});
	$('form#signupForm').submit(function(e){
		e.preventDefault();
		signUp();
	});
	$('form#loginForm').submit(function(e){
		console.log('login called')
		e.preventDefault();
		login();
	});
}
function signUp() {
	$.post(base + '/user/', $('#signupForm').serialize(), function(data, textStatus) {
		if(data.username) {
			$('input[name="[user]username"]').parent().removeClass('error');
			if($.isArray(data.username)) {
				$('input[name="[user]username"]:eq(0)').attr('data-content','Username ' + data.username[0]).popup({
					on:'focus',
			    position : 'bottom left',
				}).parent().addClass('error').on('keyup',function(){
					$(this).removeClass('error').find('input').popup('destroy');
				});
			}
		}
		if(data.email) {
			$('input[name="[user]email"]').parent().removeClass('error');
			if($.isArray(data.email)) {
				$('input[name="[user]email"]:eq(0)').attr('data-content','Email ' + data.email[0]).popup({
					on:'focus',
			    position : 'bottom left',
				}).parent().addClass('error');
			}
		}
		if(data.name) {
			$('input[name="[user]name"]').parent().removeClass('error');
			if($.isArray(data.email)) {
				$('input[name="[user]name"]:eq(0)').attr('data-content','Name ' + data.name[0]).popup({
					on:'focus',
			    position : 'bottom left',
				}).parent().addClass('error').on('keyup',function(){
					$(this).removeClass('error').find('input').popup('destroy');
				});
			}
		}
		if(data.password) {
			$('input[name="[user]password"]').parent().removeClass('error');
			if($.isArray(data.email)) {
				$('input[name="[user]password"]:eq(0)').attr('data-content','Password ' + data.password[0]).popup({
					on:'focus',
			    position : 'bottom left',
				}).parent().addClass('error').on('keyup',function(){
					$(this).removeClass('error').find('input').popup('destroy');
				});
			}
		}
	}, "json");
}
function login() {
	$.post(base + '/user/login', $('#loginForm').serialize(), function(data, textStatus) {
		if(data.username) {
			$('input[name="[user]username"]').parent().removeClass('error');
			if($.isArray(data.username)) {
				$('input[name="[user]username"]:eq(0)').attr('data-content','Username ' + data.username[0]).popup({
					on:'focus',
			    position : 'bottom left',
				}).parent().addClass('error').on('keyup',function(){
					$(this).removeClass('error').find('input').popup('destroy');
				});
			}
		}
		if(data.password) {
			$('input[name="[user]password"]').parent().removeClass('error');
			if($.isArray(data.email)) {
				$('input[name="[user]password"]:eq(0)').attr('data-content','Password ' + data.password[0]).popup({
					on:'focus',
			    position : 'bottom left',
				}).parent().addClass('error').on('keyup',function(){
					$(this).removeClass('error').find('input').popup('destroy');
				});
			}
		}
	}, "json");
}
function validEmail(email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}