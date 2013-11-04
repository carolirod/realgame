$(document).ready(function() {

	//validating the hahmo and username is done in client.socket.js

	$('#btn-ask').click(function(){
		$('#questions').slideDown();

		$('#btn-guess').slideUp();
		$('#btn-ask').slideUp();
		$('#msg').html("<br/>Select any feature from the questions' area which you think the opponent may have.");
	});


	// Questions side bar - the carousel, selecting and unselecting a feature
	$('#questions img').on('click', function () {
		$('#questions img').removeClass('desaturate');
		$(this).addClass('desaturate');
		$('#ready').html('<button id="askFeature" type="submit" class="btn long-btn">Kysy</button>');
	});



});