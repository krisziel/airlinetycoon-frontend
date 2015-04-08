var base = 'http://localhost:3000/'

$(document).ready(function(){
	if(window.document.location.origin === 'http://kziel.com') {
		base = 'http://52.11.179.216:3000/'
	}
	startApp();
});
var cookies = {};
function startApp() {
	parseCookie();
	if(cookies.user_id) {
		$.post(base + '/user/autologin/' + cookies.url, {}, function(data) {
			if(!data.username) {
				$('.login-window').modal({closable:false}).modal('show');
				activateLogin();
			} else {
				loadGames();
			}
		}, "json").error(function(){
			$('.login-window').modal({closable:false}).modal('show');
			activateLogin();
		});
	} else {
		$('.login-window').modal({closable:false}).modal('show');
		activateLogin();
	}
}
var button;
function parseCookie() {
	cookie = document.cookie.split(';');
	cookies.url = '?'
	cookie_url = {
		'user_id':'user_cookie',
		'game_id':'game_cookie',
		'airline_id':'airline_cooke'
	}
	_.each(cookie,function(value){
		key = value.split("=");
		key[0] = key[0].replace(' ','')
		if(cookie_url[key[0]]) {
			cookies[key[0]] = key[1];
			key[2] ? cookies[key[0]] += '=' + key[2] : key[1];
			cookies.url += cookie_url[key[0].replace(' ','')] + '=' + cookies[key[0]] + '&';
		}
	});
	cookies.url = cookies.url.substring(0,cookies.url.length-1);
}
function validEmail(email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}
function setCookie(args) {
	var date = new Date();
	date = new Date(date.getTime()+(30*24*60*60*1000));
	var expires = ';expires=' + date.toUTCString().replace(',','') + ';';
	destroyCookie(args.key);
	var cookieString = args.key + '=' + args.value;
	document.cookie = cookieString + expires;
	parseCookie();
}
function destroyCookie(key) {
	document.cookie = key + '=false;expires=Mon 6 Mar 1989 12:13:00 UTC';
	parseCookie();
}
$('body').on('keyup','textarea',function(){
	$(this).css('height','auto');
	$(this).height(this.scrollHeight);
});
function comma(number){
	if(parseInt(number) > 0) {
		return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	} else {
		return '';
	}
}

Array.prototype.get = function(id){ var result; _.each(this,function(item){ if(item.id&&item.id === id){ result = item; } }); return result; }
//Object.prototype.get = function(id){ var result; _.each(this,function(item){ if(item.id&&item.id === id){ result = item; } }); return result; }