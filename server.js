/*! Angular-Chat (c) Hermann Rösser License: MIT 2016-07-08 */
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
	conf = require('./config.json'),
	validChatUsers = {};

// Webserver
// set Port x 
server.listen(conf.port);

app.configure(function(){
	// deliver static data
	app.use(express.static(__dirname + '/public'));
});

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/public/index.html');
});


// checks if the key user exists in our object 'validChatUsers'
isUserOnline = function (user) {
	if(validChatUsers.hasOwnProperty(user)) 
		return true;
	else
		return false;	
};

// called for the remaining users, when user logs in, out, or gets kicked
writeUserList = function() {
		io.sockets.emit('userList',  { "usercount": Object.keys(validChatUsers).length  , "users" : Object.keys(validChatUsers)  });
};

// when client connects
io.sockets.on('connection', function (socket) {

	// first, emit the greeting message to the entered user..
	socket.emit('statusMessage', { time: new Date(), name: 'Server', text: 'Hello, please enter a chat name:', status:'ready' });

	// if 'login' is received from client, check if username is not chosen, emit welcome message
	socket.on('login',  function (data) {
		var chatName = data.name;

		if (false === isUserOnline(data.name ))	{ 
			// 1. emit welcome msg. for the loggedin user
			socket.emit('statusMessage',{ name: 'Server', chatName: chatName ,loggedIn: true, text: 'Welcome to our chat, ' + chatName  + '!', status:'chat' });
			
			// this step is important for the PM ability! add a property to the obj. 'validChatUsers': key is the name, value is the socket obj. 
			// just for this user
			validChatUsers[chatName] = socket;
			// 2. emit servermsg. (on top left) '20.15 user is joined..'
			io.sockets.emit('serverMessage', { time: new Date(), name: 'Server', text: data.name  + ' joined' });

			console.log(data.name + ' has logged in '  );
			console.log(' now users online: ' +  JSON.stringify(Object.keys(validChatUsers)));
			writeUserList();
			// 3. [optional] emit chatmsg for all in main chat window
			io.sockets.emit('chatMessage', { time: new Date(), name: 'Server', text: data.name + ' enters the chat', type: 'public'});
		} else	{
			// this username is already chosen
			socket.emit('statusMessage',{ name: 'Server', loggedIn: false, text: chatName  + ' already in use, choose another', status:'err' });
		}
	});

	// if 'logout' is received from client
	socket.on('logout',function (data) {
		var time = new Date();
  		var chatName = data.name;

		if (true === isUserOnline(data.name ))	{ 
			// 1. emit statusmsg. by leaving (top middle) logoutMessage:true is needed, because client already has set to logout
			socket.emit('statusMessage', { time: time, logoutMessage: true, name: 'Server', text: 'bye ' + data.name + ' see you next time!', status:'bye' });

			// 2. emit Servermsg. (on top left)				
			io.sockets.emit('serverMessage', { time: time, logoutMessage: true, logoutUser: data.name , name: 'Server', text: data.name  + ' left'});
	
			// simple and performant way to delete an obj. property 
			delete validChatUsers[chatName];
			writeUserList();

			// 3. [optional] emit chatmsg for all in main chat window
			io.sockets.emit('chatMessage', { time: new Date(), name: 'Server', text: data.name + ' has left the chat', type: 'public' });

			console.log(data.name + ' has logged out '  );
			console.log(' remaining users online: ' +  JSON.stringify(Object.keys(validChatUsers)  ));
		}
	});


	socket.on('userMessage', function (data) {
		if ( isUserOnline(data.name) === true) {

			var sender = data.name;
	
			// if the property 'privateTo' is sent 
			if (data.isPrivate  === true) {
				console.log(data.text + ' is private to ' + data.privateTo );
				// important! pick the corresonding socket of the obj. 'validChatUsers' and send the pm exclusivly through it
				var targetSocket = validChatUsers[data.privateTo];
				
				try {
					// ***** PRIVATE MESSAGE => to recipient ***********
					targetSocket.emit('chatMessage', { time: new Date(), name: sender, text: data.text, type: 'privateTo' });
				} catch (err) {
					console.log("Error:", err);
				}
			
				// ***** PUBLIC MESSAGE => return to sender ***********
				// send back the msg. to sender  <b>: orange !
				targetSocket = validChatUsers[sender];
				targetSocket.emit('chatMessage', { time: new Date(), name: sender, text: data.text, type: 'privateSelf', goesTo: data.privateTo });
	
			} else {  // ***** PUBLIC MESSAGE ***********
	 			console.log(sender + ' (public) sends: ' + data.text );
				io.sockets.emit('chatMessage', {time: new Date(), name: sender, text: data.text, type: 'public' });
			}
		}

	});
});

console.log('Server runs on: http://127.0.0.1:' + conf.port + '/');


