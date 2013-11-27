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
				$('#carousel-hahmo img').removeClass('desaturate');
				$(this).addClass('desaturate');
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
							$('#welcoming').append($userName.nickname);
							$('#welcomeImg').html('<img src="'+ selectedIMG +'" />');	
							//for the control panel of later
							$('#hahmosi').html('<img src="'+ selectedIMG +'" />');
							//your name displayed
							$('#you').html($userName.nickname);
							$('#startscreen').slideDown();
							$('#carousel-hahmo img').removeClass('desaturate');
						} else {
							$nickError.html('That username is already taken, try again!');
						}
					});
				//}
			});

			//displaying the usernames' array
			socket.on('usernames', function(data){
				var html = '';
				
				console.log(data);		
				//remove self from username list/array
				var removeSelf = $userName.nickname;
				data.splice($.inArray(removeSelf, data), 1);

				console.log(data.length);

				if (data.length == 0) {
					html += '<span style="color:#FFFFFF">There is no available users to play now, call a friend!</span>';
					$users.html(html);
				} else {
					
					for (var i = 0; i < data.length; i++) {
						html += '<li>'+ data[i] + '</li>';
						$users.html(html);
					}
				}			

				//initiate the carousel
				$('#userList').carouFredSel({
					responsive: true,
					direction: 'up',
					height: '40%',
					items: {
						//dont set the height to % of the items, it doesnt show carousel at all then
						minimum: 6,
						visible: 5
					},
					scroll: {
						items: 1
					}
				}, {
					wrapper: {
						classname: 'userwrap'
					}
				});

				$('#userList li').css('height','3%'); // need to fix yet though -apaño-
				//THIS CHUNK checks if there is a selected contrincant
				//needs to be inside the socket.on 'usernames'
							// selected contrincant
							var $contrincant = null;
							var errorSel = null;

							$('#userList li').on('click', function(){
								$('#userList li').css('background','#4D4D4D');
								$(this).css('background-color','darkgray');
								$contrincant = $(this).html();
							});

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
									$('#instructions').html("<br/>Valitse sivuvalikosta joku ominaisuus, jonka uskot vastapelaajasi hahmolla olevan.");
									//show that in the control panel
									$('#contrincant').html($contrincant);
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
			
			socket.on('usernames taken', function(data){
				console.log('Please dont choose ' +data.user1+ ' nor '+data.user2+ ' because they are already playing');
				$('li:contains('+data.user1+'), li:contains('+data.user2+')').append('<span id="taken"> --Sorry Im playing already</span>').off('click');
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
				$('#instructions').html('Odota vuoroasi');
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
			//Kysy button is pressed (ask a question about a feature)
			$('#btn-ask').on('click', function(){
				//the selected feature string
				var $feature = $('.feature').attr('src');
				var $contrincant = $('#contrincant').html();
			
			//...the player sends the question to the server
				socket.emit('asking question', { opp: $contrincant, feat: $feature }, function(data) {});

				//the player has to wait
				$('#instructions').html('Odota kunnes vastapelaaja vastaa kysymykseesi');
				$('#features').slideUp();

			});

			// the contrincant receives a question about a feature
			socket.on('asked a question', function(data){				
				//the opponents name
				$('#opp').html(data.nick);

				//the feature that the opponent asked
				$('#feature').html('<img src="'+ data.feat +'" class="img-responsive"/>')
				//what to do
				$('#instructions').html('Tarkista, onko hahmollasi kysyttävä ominaisuus');
				$('#singlequestion').slideDown();
				//alert('your contrincant '+ data.nick+ ' wants to ask you if you have '+ data.feat);
			});

			//You press yes... you DO have the feature...
			$('#yes').on('click', function(){
				var $feature = $('#feature img').attr('src');
				var $contrincant = $('#contrincant').html();

				//...and wait
				$('#singlequestion').slideUp();
				$('#instructions').html('Odota kunnes vastapelaajasi on valmis');

				//...and the opponent gets to discard the appropiate cards
				socket.emit('yes has feature', {feat: $feature, opp: $contrincant}, function(data){});
			});

			//You press no... you DONT have the feature
			$('#no').on('click', function(){
				var $feature = $('#feature img').attr('src');
				var $contrincant = $('#contrincant').html();

				//...wait
				$('#singlequestion').slideUp();
				$('#instructions').html('Odota kunnes vastapelaajasi on valmis');

				//...and the player gets to dicard appropiate cards
				socket.emit('no has feature', {feat: $feature, opp: $contrincant}, function(data){});
			});

			//You receive the AFFIRMATIVE answer to feature (to the question that you sent)
			socket.on('yes to feature', function(data){
				var $ins = 'Poista hahmot, jotka eivät sovi saamaasi vastaukseen painamalla hahmoja taulukossa';
				$('#instructions').html($ins);
				
				$('#answer').html('Kyllä minulla on...');
				//show the feature to which they have answered
				$('#checkFeat').html('<img src="'+data.feat+'" />');
			
				$('#readyArea').slideDown();
				//bind click on the board images
				$('#board img').bind('click', desaturateHahmo);
			});

			//You receive the NEGATIVE answer to feature (to the question that you sent)
			socket.on('no to feature', function(data){
				var $ins = 'Poista hahmot, jotka eivät sovi saamaasi vastaukseen painamalla hahmoja taulukossa';
				$('#instructions').html($ins);

				$('#answer').html('Minulla ei ole...');
				//show the feature to which they have answered
				$('#checkFeat').html('<img src="'+data.feat+'" />');
				$('#readyArea').slideDown();
				//bind click on the board images
				$('#board img').bind('click', desaturateHahmo);
			});

			//You are done discarding cards -of your pelilauta, play board-
			$('#ready').on('click', function(){
				//when you click ready, the faces that have been selected, should not be selectable anymore
					//any of the images are selectable in the beginning
					$('#board img').unbind('click', desaturateHahmo);

				$('#readyArea').slideUp();
				$('#instructions').html('Nyt on toisen vuoro, odota hetki.');
				var $contrincant = $('#contrincant').html();
				socket.emit('others turn', $contrincant, function(data){});
			});

			socket.on('your turn', function(){
				$('#features').slideDown();
				$('#instructions').html('Nyt on sinun vuorosi kysyä vastapelaajasi hahmon ominaisuutta' );
			});

			// Arvaa button is pressed
			$('#btn-guess').on('click', function(){
				var $contrincant = $('#contrincant').html();
				$('#instructions').html('Valitse hahmo, jonka luulet sinun vastustajalla olevan. Kun olet valittanut hahmon, paina "VALMIS" ja kysymys lähetetään vastustajallesi');
				$('#board img').bind('click', chooseOneHahmo);

				$('#features').slideUp();
				$('#readyArea2').slideDown();
			});

			//You are done selecting the card you want to guess from your opponent
			$('#readyGuess').on('click', function(){

				//when you click ready, the faces that have been selected, should not be selectable anymore
				//any of the images are selectable anymore
				$('#board img').unbind('click', chooseOneHahmo);

				$('#readyArea2').slideUp();
				$('#instructions').html('Nyt katsotaan arvasitko hahmon oikein, odota hetki.');
				var $contrincant = $('#contrincant').html();

				var $hahmo = $('#board img[style="border-style: groove;"]');
				//choose one with a class okay???
				socket.emit('hahmo to guess', { hahmo: $hahmo.attr('src'), opp: $contrincant}, function(data){});
			});	

			//You get the hahmo that is suposed to be you from your opponent
			socket.on('guessing your hahmo', function(data) {
				var $hahmo = data.hahmo;
				var $contrincant = data.opp;
				$('#instructions').html('Sinun vastustajasi '+ $contrincant +', haluaa arvata sinun hahmosi, kerro hänelle onko arvaus oikein.');
				$('#checkHahmo').html('<img src="'+ $hahmo +'" />');
				$('#guessingArea').slideDown();
			});

			//when #yesToGuess button
			$('#yesToGuess').on('click', function() {
				<!---- You loose and your opponent wins ---->
				$('#guessingArea').slideUp();

				$('#instructions').html('Sinun vastapelaaja arvasi oikein! Pelataksesi uudestaan, paina "valitse toinen vastapelaaja"');
				$('#finMessage').html('Your hahmo was guessed! Do you want to play again?');
				$('#playAgain').slideDown();
				
				var $contrincant = $('#contrincant').html();
				socket.emit('you win', $contrincant, function(data){});
			});
			
			//when #noToGuess button
			$('#noToGuess').on('click', function() {
				<!---- Your turn ---->
				$('#guessingArea').slideUp();
				$('#instructions').html('Vastapelaajasi menetti pelivuoronsa ja nyt on sinun vuorosi.');
				$('#features').slideDown();
				var $contrincant = $('#contrincant').html();
				socket.emit('you wait', $contrincant, function(){});
			});

			socket.on('I wait', function(){
				$('#instructions').html('Arvauksesi oli väärä, nyt odota kunnes vastapelaajasi pelaa');
			});

			socket.on('I win!', function(data){
				$('#instructions').html('Pelataksesi uudestaan paina "Valitse toinen vastapelaaja".');
				//show the hahmo instead of the question marked hahmo
				var $hahmo = $('#board img[class="#000000"]').attr('src');
				$('#opponent img').attr('src', $hahmo);
				$('#finMessage').html('You win!!!!! It was that hahmo indeed! Do you want to play again?');
				$('#playAgain').slideDown();
			});

			//play again
			$('#again-btn').on('click', function(){
				location.reload();
			});

			//if one closes the window, the one that he was playing with goes to the usernames list again
			//with a message that your opponent left
});

//when board hahmot are binded, then they are selectable and so they can be desaturated
function desaturateHahmo(){
	$(this).toggleClass('desaturate');
}

function chooseOneHahmo(){
	//when guessing, only one hahmo can be selected
	$('#board img').css('border-style','outset');
	$(this).css('border-style','groove');
}