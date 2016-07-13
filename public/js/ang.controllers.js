'use strict';

angular.module('chatApp.controllers', [])

	.controller('chatAppCtrl', function ( $scope, btfordSocket, chatHelpers, appConf, userService, 
		   handlerChatMessages, handlerServerMessages,handlerUserlist, soundService) {

		var 	chatMessages = [],
				chatLineCount = 0,
				serverMsgCount = 0,
				sMsgs = [],
				socket = btfordSocket;

		$scope.showChatBar = false;
		$scope.showLogin = true;
		$scope.privateMessageTo = '';
		$scope.chatText  = '';
		$scope.soundInit  = "on" ;		// 'on','off'

		// dis/ enable input bar/Buttons
		$scope.disable_send = "disabled";
		$scope.disable_logout = "disabled";
		$scope.disable_login = "";


		$scope.toggleSound = function(switchTo) {
			soundService.toggleSoundState(switchTo);
		}


		// called by Directive 'divUser'
		$scope.togglePm = function(user,state,index )	{

			handlerUserlist.toggleUserState(index,state,user);

			var userState = handlerUserlist.getUserByIndex(index);

			// change style and property for the desired PM User
			$scope.participants.users[index].state = userState.state;
			if (userState.state == 'privateTo')  {

				// Prefix in <input> bar
				$scope.privateMessageTo = userState.name + ': ';
			}
			else	 {
				$scope.privateMessageTo = '';
			}
		}

		// from Server
		socket.on('statusMessage', function (message) {  

			$scope.serverStatus 	= message.status; 	// 'READY', 'ERR' 'BYE'
			$scope.serverGreeting 	= message.text; 	// ..'Hello, please enter your name'

			// the server grants the login process 
			if (message.loggedIn === true) {  // successful login
				// login routine angularseitig
				$scope.showChatBar = true;
				$scope.showLogin = false;
				$scope.disable_send = "";
				$scope.disable_logout = "disabled";	// write HTML attributs
				$scope.disable_login = "disabled";
				$scope.chatText = "";

				// set User Data in Service
				userService.setUserObj( 'chatName', message.chatName );
				userService.setUserObj( 'loggedIn', true );
			} 
	  	});

		// from Server
		socket.on('chatMessage', function (message) 	{  

			if (true === userService.isLoggedIn())	{
				//play or mute? is set in the service
				//audio.play();  playPMSound(), muteMe(),  muteOff() ,      .text-orange {

				message.messagePre = '' ;
				message.fromUserClass = '';

				switch (message.type) {
					case 'privateSelf' :   
						message.messagePre = 'to: '+ userService.isPrivateTo() +' ';
						soundService.playChatSound('chatMsg');	// may apply here custom chat sound 
		  			break ;

					case 'privateTo' :
						message.messagePre = '';
						message.fromUserClass = 'text-orange'; 
						soundService.playChatSound('chatMsg'); // also here
					break ;

					default: 
				}

				chatMessages.push(message);
				handlerChatMessages.pushChatMessage(message);
				$scope.messages = handlerChatMessages.getChatMessages();

			}	
	  	});

		// Server sends new Userlist
		socket.on('userList', function (data) {
			if (userService.isLoggedIn() )  	{
				//			if (userObj.loggedIn === true) 				writeUserList(data); //  
				handlerUserlist.setUsers(data);
				$scope.participants = { 'users': handlerUserlist.getUsers()  ,  'userCount': data.usercount   };
			}
		});

		// Servermessage
		socket.on('serverMessage', function (data) {
			if (userService.isLoggedIn() )  	{

				//  --------  hier knallt er ! 
	 			handlerServerMessages.pushServerMessage(data); 
				// see ang.services:   dataMapper  writeServerMessage(data);
				// if the remote user logs off whilst in PM Conversation here
				if (data.logoutMessage && ( data.logoutUser == userService.getUserObj('privateTo') ) && ( userService.isInPrivate() ))  { 
					//  dataMapper =>  togglePmOff(data.logoutUser,'socket');
				}
				$scope.serverMessages =	 handlerServerMessages.getServerMessages();
			}
		});

		// Login using scope variables
		$scope.emitLogin = function () {
			socket.emit('login', {
				name: $scope.chatName
			});
		}

		// Logout using Service variables
		$scope.emitLogout = function () {
			if (userService.isLoggedIn() )	{	
				//
				socket.emit('logout', {
					name:  userService.getUserObj('chatName')
				});
				$scope.showChatBar = false;
				$scope.showLogin = true;
				$scope.disable_send = "disabled";
				$scope.disable_logout = "disabled";
				$scope.disable_login = "";
				$scope.participants = {};

				// then tell the Service to set off login status
				userService.logOut();  
 			} 
		}

		$scope.emitChat = function (type) { 

			var pmGoesTo = '';
			var priv = false;
			var chatName = userService.getUserObj('chatName');

			if (userService.isInPrivate ())	{
				pmGoesTo = userService.isPrivateTo(); // undefi. 
				priv = true;
			}
					
			socket.emit('userMessage', {
				name: chatName,						//$scope.chatName,
			  	text: $scope.chatText.trim(),
				isPrivate: priv,
				privateTo: pmGoesTo 
			});
			$scope.chatText = '';

			// Try to find the correct scroll position after drawing chat msg. 
			var elem = $('#main');
			var gap = $(window).height() - 120 - $('#talk-box-output').innerHeight();
			// then scroll down 
			if (gap <= 0)
				$('html, body').animate({scrollTop: elem.height() }, 1100);
				//$('html, body').animate({scrollTop: $(window).height() }, 1200);

		};

})


