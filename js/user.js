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
		e.preventDefault();
		login();
	});
}
function signUp() {
	$.post(base + '/user/', $('#signupForm').serialize(), function(data, textStatus) {
		if(data.username) {
			loginErrorHandler({inputName:'[user]username',fieldName:'Username',value:data.username});
		}
		if(data.email) {
			loginErrorHandler({inputName:'[user]email',fieldName:'Email',value:data.email});
		}
		if(data.name) {
			loginErrorHandler({inputName:'[user]name',fieldName:'Name',value:data.name});
		}
		if(data.password) {
			loginErrorHandler({inputName:'[user]password',fieldName:'Password',value:data.password});
		}
		if(data.cookie) {
			setCookie({key:'user_id',value:data.cookie});
			document.cookie = "airtycoon_user=" + data.cookie + expires;
			loadGames();
		}
	}, "json");
}
function login() {
	$.post(base + '/user/login', $('#loginForm').serialize(), function(data, textStatus) {
		if(data.username) {
			loginErrorHandler({inputName:'username',fieldName:'Username',value:data.username});
		}
		if(data.password) {
			loginErrorHandler({inputName:'password',fieldName:'Password',value:data.password});
		}
		if(data.cookie) {
			setCookie({key:'user_id',value:data.cookie});
			loadGames();
		}
	}, "json");
}
function loginErrorHandler(args) {
	$('input[name="' + args.inputName + '"]').parent().removeClass('error');
	if($.isArray(args.value)) {
		$('input[name="' + args.inputName + '"]').attr('data-content',args.fieldName + ' ' + args.value[0]).popup({
			on:'focus',
	    position : 'bottom left',
		}).parent().addClass('error').on('keyup',function(){
			$(this).removeClass('error').find('input').popup('destroy');
		});
	}
}