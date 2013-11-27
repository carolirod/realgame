//This is the server side
/*
express		module
nicknames	array
*/
var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	users = {}; // values will be the sockets	

server.listen(11339);

//routing
app.get('/', function(req, res){
	res.sendfile(__dirname + '/index.html');
});

app.configure(function(){
	app.use("/", express.static(__dirname + '/'));
});

//receive the event on the server side
//socket functionality in our server side too.
	//every user that enters a socket io application,
			// they turn on a connection
			// they have their own socket
	// -- more or less like jquery(document)ready
io.sockets.on('connection', function(socket){
	// 2.nickname  // receive our event
		// callback to the client (send back data to the client)
	socket.on('new user', function(data, callback){
		//check if another user online
		if(data in users){
			callback(false);
		} else {
			callback(true);
			//add the nickname to the socket --> a property of the socket
			socket.nickname = data;
			socket.occupied = false; //Boolean false if free to play, true if playing already
			users[socket.nickname] = socket;

			updateNicknames();
		};
	});

	//update usernames' list
	function updateNicknames(player1, player2){
		// send respond to client, the object key
		io.sockets.emit('usernames', Object.keys(users));
	}

	//display startscreen to opponent
	socket.on('contrincant', function(data) {
		console.log('the name of the selected contrincant: '+data+', will play against: '+socket.nickname);
		
		//the contrincant should get the board
		users[data].emit('start playing',{nick: socket.nickname});
		
		console.log('These users: '+ users[socket.nickname] +' and '+ users[data] +' are playing, so they are removed from the user list');
		delete users[socket.nickname];
		delete users[data];
	});

	
	//Asking question
	socket.on('asking question', function(data){
		var $feature = data.feat;
		//the contrincant gets the question to answer yes or no
		users[data.opp].emit('asked a question',{nick: socket.nickname, feat: $feature});
	});
	
	//Guessing hahmo
	socket.on('hahmo to guess', function(data) {
		var $hahmoSource = data.hahmo;
		users[data.opp].emit('guessing your hahmo', { hahmo: $hahmoSource, opp: socket.nickname});
	});

	socket.on('yes has feature', function(data){
		var $feature = data.feat;
		//the player gets the affirmative answer
		users[data.opp].emit('yes to feature', {nick: socket.nickname, feat: $feature});
	});
	socket.on('no has feature', function(data){
		var $feature = data.feat;
		//the player gets the affirmative answer
		users[data.opp].emit('no to feature', {nick: socket.nickname, feat: $feature});
	});

	socket.on('you win', function(data) {
		users[data].emit('I win!', socket.nickname, function(data){});
		updateNicknames(); //update usernames in all client's views
	});

	socket.on('others turn', function(data){
		users[data].emit('your turn');
	});

	socket.on('you wait', function(data){
		users[data].emit('I wait');
	});


	//when disconnect
	socket.on('disconnect', function(data){
		if(!socket.nickname){
			return;
		}
		delete users[socket.nickname];
		updateNicknames();			
	});

//not in use right now
	// 1.receive messages
	socket.on('send message', function(data, callback){
		var msg = data.trim();
		if(msg.substr(0,3) === '/w '){
			msg = msg.substr(3);
			var ind = msg.indexOf(' ');
			if(ind != -1){
				var name = msg.substr(0, ind);
				var msg = msg.substr(ind+1);
				if(name in users){
					users[name].emit('whisper', {msg: msg, nick: socket.nickname });
					console.log('whisper!');
				} else {
					callback('Error: enter a valid user<br/>');
				}			
			} else {
				callback('Error: please enter a message for your whisper<br/>');
			}

		} else {
			//send the username attached to the message, 
			//sending multiple things
				//msg instead of data because msg is trimmed
			io.sockets.emit('new message', {msg: msg, nick: socket.nickname });
		}

		//sending, passing the data to all the users
		//io.sockets.emit('new message', data);
		
		//sending to everyone, except me
		//socket.broadcast.emit('new message',data);
	});

});