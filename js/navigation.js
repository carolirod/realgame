$(document).ready(function() {

	//validating the hahmo and username is done in client.socket.js

	// Features side bar - the carousel, selecting and unselecting a feature
	$('#features img').on('click', function () {
		$('#features img').removeClass('desaturate');
		$(this).addClass('desaturate');
	});

	
	//when they are binded, then they are selectable and so they desaturate
	function desaturateHahmo(){
		$('#board img').removeClass('desaturate');
		$(this).addClass('desaturate');
	}
});