jQuery(function($){
			var socket = io.connect();

			var $userForm = $('#userForm');
			var $nickError = $('#usererror_msg');
			var $userName = $('#userName');
			var $users = $('#userList');
			var $messageForm = $('#send-message');
			var $messageBox = $('#message');
			var $chat = $('#chat');
			

			$userForm.submit(function(e){
				e.preventDefault();
				socket.emit('new user', $userName.val(), function(data){
					//respond arrives to client
					if(data){
						
						$('#loginscreen').slideUp();
						$('#welcoming').append('<h3>Welcome '+ $userName.nickname+'!</h4>');
						$('#startscreen').slideDown();
						$(window).trigger('resize');

					} else {
						$nickError.html('That username is already taken, try again!');
					}
				});
				$userName.val('');
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