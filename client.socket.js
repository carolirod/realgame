jQuery(function($){
			var socket = io.connect();

			var $userForm = $('#userForm');
			var $nickError = $('#userError');
			var $userName = $('#userName');
			var $users = $('#userList');
			var $charError = $('#charError');
			var $messageForm = $('#send-message');
			var $messageBox = $('#message');
			var $chat = $('#chat');
			
			// selected face
			var selectedIMG = null;
			var error = '';
			$('#carousel-hahmo img').on('click',function (){
				$('#carousel-hahmo img').css('border','none');
				$(this).css('border', 'solid');
				selectedIMG = $(this).attr('src');
			});
			

			$userForm.submit(function(e){
				e.preventDefault();
				$userName.nickname = $userName.val();
				/*
				if($userName.nickname == '' && selectedIMG == null){
							error = 'Please introduce a fictional username';
							error += '<br/>Please select a hahmo (your card that the other has to guess)';
							$nickError.html('<span style="color:red">'+error+'</span>');
						
				} else if($userName.nickname == ''){
					error = 'Please introduce a fictional username';
					$nickError.html('<span style="color:red">'+error+'</span>');

				} else if(selectedIMG == null) {			
					error = 'Please select a hahmo (your card that the other has to guess)';
					$charError.html('<span style="color:red">'+error+'</span>');
				
				} else {
					*/
					socket.emit('new user', $userName.nickname, function(data){
						//client talks

						if(data){
							$('#loginscreen').slideUp();
							$('#welcoming').append('<h3>Tervetuloa '+ $userName.nickname+'!</h4>');
							$('#welcomeIMG').html('<img src="'+ selectedIMG +'" />');	
							//for the control panel of later
							$('#hahmosi').html('<img src="'+ selectedIMG +'" />');
							//your name displayed
							$('#you').html($userName.nickname);
							$('#startscreen').slideDown();
						} else {
							$nickError.html('That username is already taken, try again!');
						}
					});
				//}
			});

			//displaying the usernames' array
			socket.on('usernames', function(data){
				var html = '';
				for (var i = 0; i < data.length; i++) {
					html += '<li>'+ data[i] + '</li>';
				}
				$users.html(html);
				//initiate the carousel
				$('#userList').carouFredSel(
					{
					direction: 'up',
					height: '100%',
					items: {
						minimum: 6,
						visible: 5
					},
					scroll: {
						items: 1
					}
				});
				//THIS CHUNK checks if there is a selected contrincant
							// selected contrincant
							var $contrincant = null;

							$('#userList li').on('click', function(){
								$('#userList li').css('background','#4D4D4D');
								$(this).css('background-color','darkgray');
								$contrincant = $(this).html();
							});

							var errorSel = null;

							$('#play').click(function(){
								
								if ($contrincant == null) {
									//if no contrincant was selected, please do
									errorSel = 'Please select a contrincant';
									$('#select-error').html('<span style="color:red">'+errorSel+'</span>');
								} else {
									//if one valid contrincant has been selected
									
									//store who is the contrincant in user's socket
									socket.emit('contrincant', $contrincant, function(data){
										//send to the server the name of the contrincant so that 
										//it appears the board game to the contrincant and tells him
										//that she is going to play against player
									});
									
									//Setup the control panel
									$('#instructions').html("<br/>Select any feature from the features' area which you think the opponent may have.");
									//show that in the control panel
									$('#opponent').html('You are playing with: <span id="contrincant">'+$contrincant+'</span>');
									//it's own hahmo appears in the control panel //this is set after logining in

									//any of the images are selectable in the beginning
									$('#board img').unbind('click', desaturateHahmo);

									//hide and show right screen
									$('#startscreen').slideUp();
									$('#boardscreen').slideDown();
								};
							});
				//end of validation

			});

			//every time the submit button is pressed
			$messageForm.submit(function(e){
				//prevent the default refresh of the page
				e.preventDefault();
				/* Send it to the server
				socket.emit()
				name the event: send message
				---data we are sending--- IMPORTANT ---
				*/
				socket.emit('send message', $messageBox.val(), function(data){
					$chat.append('<span class="error">'+data+'</span>');
				});
				//empty the input box
				$messageBox.val('');
			});
			
			//receive the message on the client side
			socket.on('new message', function(data){
				//handle the data received
				$chat.append('<span class="msg"><b>'+ data.nick + ": </b>"+ data.msg+"<br/></span>");
			});

			socket.on('whisper', function(data){
				$chat.append('<span class="whisper"><b>'+ data.nick + ": </b>"+ data.msg+"<br/></span>");
			});

			//the contrincant gets the start playing screen but he can't do anything than wait
			socket.on('start playing', function(data){
				//the contrincant should be displayed the board game
				//alert('this user wants to play with me: '+data.nick);

				//Setup the control panel
				$('#instructions').html('Wait until is your turn');
				//show the contrincant that "chose you" in control panel
				$('#contrincant').html(data.nick);
				//and wait, freeze the images so they are not selectable
				//any of the images are selectable in the beginning
				$('#board img').unbind('click', desaturateHahmo);

				$('#startscreen').slideUp();
				$('#features').slideUp();
				$('#boardscreen').slideDown();
				
			});

			//when the player asks a feature from the opponent...
			$('#btn-ask').on('click', function(){
				//the selected feature string
				var $feature = $('.desaturate').attr('src');
				var $contrincant = $('#contrincant').html();
			
			//...the player sends the question to the server
				socket.emit('asking question', { feat: $feature, opp: $contrincant }, function(data) {});

				//the player has to wait
				$('#instructions').html('Wait until your contrincant answers the question');
				$('#features').slideUp();

			});

			// the contrincant is asked a question
			socket.on('asked a question', function(data){				
				//the opponents name
				$('#opp').html(data.nick);

				//the feature that the opponent asked
				$('#feature').html('<img src="'+ data.feat +'"/>')
				//what to do
				$('#instructions').html('Tarkistaa jos sinun hahmollasi on kyseessä ominaisuus');
				$('#singlequestion').slideDown();
				//alert('your contrincant '+ data.nick+ ' wants to ask you if you have '+ data.feat);
			});


			//when opponent has been asked the question and presses yes...
			$('#yes').on('click', function(){
				var $feature = $('#feature img').attr('src');
				var $contrincant = $('#contrincant').html();

				//...the opponent gets the turn to ask a feature
				$('#singlequestion').slideUp();
				$('#instructions').html('Wait until your contrincant discards the cards according to your answer');

				//...and the player gets to discard the appropiate cards
				socket.emit('yes has feature', {feat: $feature, opp: $contrincant}, function(data){});
			});

			//when opponent has been asked the question and presses no...
			$('#no').on('click', function(){

			});

			socket.on('yes to feature', function(data){
				var $ins = 'Now discard the cards according to the affirmative answer. <br/>The ones that dont have the feature may be discarded by clicking on the cards to select (you can unselect also by clicking them again).<br/> When you are ready press button READY.';
				$('#instructions').html($ins);
				//show the feature to which they have answered
				$('#checkFeat').html('<img src="'+data.feat+'" />');
				$('#readyBtn').slideDown();
				//bind click on the board images
				$('#board img').bind('click', desaturateHahmo);
			});

			$('#ready').on('click', function(){
				//when you click ready, the faces that have been selected, should not be selectable anymore
					//any of the images are selectable in the beginning
					$('#board img').unbind('click', desaturateHahmo);
				$('#readyBtn').slideUp();
				$('#instructions').html('Now your opponent is playing, wait until is your turn.');
				var $contrincant = $('#contrincant').html();
				socket.emit('others turn', $contrincant, function(data){});
			});

			socket.on('your turn', function(){
				$('#features').slideDown();
				$('#instructions').html('Now you get the chance to ask a feature from' );
			});
});

//when board hahmot are binded, then they are selectable and so they can be desaturated
function desaturateHahmo(){
	$(this).toggleClass('desaturate');
}