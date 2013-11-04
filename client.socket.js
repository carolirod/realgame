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

				socket.emit('new user', { user: $userName.nickname, pic: selectedIMG}, function(data){
					//respond arrives to client		

					if(data){

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
							$('#loginscreen').slideUp();
							$('#welcoming').append('<h3>Tervetuloa '+ $userName.nickname+'!</h4>');
							$('#welcomeIMG').html('<img src="'+ selectedIMG +'" />');
							$('#startscreen').slideDown();
						}
					} else {
						$nickError.html('That username is already taken, try again!');
					}
					
				});
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
					items: {
						visible: 5
					},
					scroll: {
						items: 1
					}
				});
				//THIS CHUNK validates client hahmo and userplayer
							
							// selected the user
							var selectedVS = null;

							$('#userList li').on('click', function(){
								$('#userList li').css('background','#4D4D4D');
								$(this).css('background-color','darkgray');
								selectedVS = $(this).css('background-color','darkgray');
							});

							var errorSel = null;
							/* From selection(hahmo and vastustaja) screen to board screen*/
							$('#play').click(function(){
								
								if (selectedVS == null) {
									errorSel = 'Please select a contrincant';
									$('#select-error').html('<span style="color:red">'+errorSel+'</span>');
								} else {
									//Setup the control panel
									$('#nameboard').html('Pelilauta');
									$('#action').html('You are playing against: xxxx');
									$('#hahmosi').html('<img src="'+ selectedIMG +'" />');

									//if everything is alright GO FORWARD
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
});