$(document).ready(function() {
	$('#username').keydown(function(e){
		if(e.keyCode == 13){
			$('startgame').trigger('click');
		}
	});
	$('#startgame').on('click',function(){
		
		if($('#username').val()){
			
			$('#loginscreen').slideUp();
			var username = $('#username').val();
			$('#welcoming').append('<h4>Welcome '+username+'!</h4>');

			
			$('#startscreen').slideDown();
			$(window).trigger('resize');

		} else {
			var error = 'Please introduce a fictional username';
			$('#login').append('<span style="color:red">'+error+'</span>');
		}
		
	});

	//validating the hahmo and username is done in client.socket.js

	$('#btn-ask').click(function(){
		$('.leftside').slideDown();
		$('#btn-guess').slideUp();
		$('#btn-ask').slideUp();
		$('#msg').html("<br/>Select any feature from the questions' area which you think the opponent may have.");
	});


	// Questions side bar - the carousel, selecting and unselecting a feature
	$('.extrawrap img').on('click', function () {
		$('.extrawrap img').css('border', 'none');
		$(this).css('border', 'solid');
	});

});