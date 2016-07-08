'use strict';

angular.module('chatApp.services', [] )

	/***
	*	sets the properties for the CURRENT User
	*	don't confuse with service 'handlerUserlist' there all users are handled
	*	userService.setUserObj('setPrivate',true )	userService.setUserObj  ('privateTo ','name' )	

	userService.setUserObj('setPrivate',true); 	// the state of the user itself
	**/
	.factory ('soundService', function () {
		var audio = document.getElementById("chatAudio"),	// HTML5 Audio Tag
			speaker = document.getElementById("speaker"),	// speaker symbol top/left (DIR)
		 	mute = false,
		 	volume = 6, // future use
		 	soundSources = { 'joinSound':'','leaveSound':'','chatSound':'../sound/chat.ogg','privateMessageSound':'' };
		return {

			playChatSound: function(type)	{			// 'chatMsg', 'privMsg'
				if (!this.mute)	{
					switch (type)	{
						case 'chatMsg': 
							audio.src = soundSources.chatSound;
							audio.play();
						break;
						case 'privMsg': 
							audio.src = soundSources.privateMessageSound;
							audio.play();
						break;
						default:
					} 
				}
			}, 
			playPMSound: function()	{
				audio.src = soundSources.privateMessageSound;
				if (!this.mute)	{
					audio.play();
				}
			},
			toggleSoundState: function(switchTo)	{ 
				if (switchTo ==  'mute')	{
					console.log('# soundservice: snd was ON, switch sound MUTE > arg:' + switchTo );
					this.mute = true;
					//elem.style = 'sound-on';  //class="sound-on"
				} else	{
					this.mute = false;
					console.log('# soundservice : snd was OFF, switch sound ON typ: ' + switchTo  )	; 
					//elem.style = 'sound-off';  //class="sound-off"
				}
			},
			isMuted: function()	{
				return this.mute;
			},
			muteMe: function()	{
				this.mute = true;
			},
			muteOff: function()	{
				this.mute = false;
			}
		}
	})

	.factory ('userService', function () {
		var userObj = {  'chatName':'', 'setPrivate':false, 'privateTo':'', 'loggedIn':false	};	// start val. 
		return {
			//  call: userService.setUserObj(  { 'chatname', 'john' })
			setUserObj: function( key,val)	{
				userObj[key] = val;
			},
			//  call: userService.getUserObj(  { 'chatname'})
			getUserObj: function(key)	{	
				return userObj[key] ;
			},
			isLoggedIn:	function()	{	// bool
				return userObj.loggedIn;
			},
			isInPrivate:	function()	{	// bool
				return userObj.setPrivate;
			},
			isPrivateTo:	function()	{	// str
				return userObj.privateTo;
			},
			logIn: function()	{
				userObj.loggedIn = true;
			},
			logOut: function()	{
				userObj.loggedIn = false;
			},

			/* obsolete */
			setEntireUserObj: function(obj)	{
				 userObj = obj;
			},
			getEntireUserObj: function()	{
				return userObj;
			}
		};
	})

	.factory ('handlerChatMessages', function (chatHelpers,appConf) {
		var chatMessages = [];
		return {
			pushChatMessage: function(message)	{
				//#76 serv.msg {"time":"2016-05-12T22:38:17.085Z","name":"Server","text":"Hermann joined","$$hashKey":"object:16"}
				message.time = chatHelpers.formatTime(message.time) ; // to '15:41' 24h format
				chatMessages.push(message);
					if (chatMessages.length > appConf.maxChatMessages)
						chatMessages.slice(0,1);	
			},
			getChatMessages: function()	{
				return chatMessages;
			},
			getChatMessage: function(index)	{
				return chatMessages[index];
			},
			resetChatMessages: function()	{
				chatMessages = [];
			}
		};
	})

	.factory ('handlerServerMessages', function (chatHelpers,appConf) {
		var serverMessages = [];
		return {
			pushServerMessage: function(data)	{
			//#76 serv.msg {"zeit":"2016-05-12T22:38:17.085Z","name":"Server","text":"Hermann joined","$$hashKey":"object:16"}
			data.time = chatHelpers.formatTime(data.time) ; // to '15:41' 24h format
			serverMessages.push(data );

				if (serverMessages.length > appConf.maxServerMessages)	{
					serverMessages =  serverMessages.slice(1, serverMessages.length );	
				
				}
			},
			getServerMessages: function()	{
				return serverMessages;
			},
			getServerMessage: function(index)	{
				return serverMessages[index];
			},
			resetServerMessages: function()	{
				serverMessages = [];
			}
		};
	})

	/*** handlerUserlist
	**** 
	**** called by server when user joins, leaves, private Message, state change ('away' ...)
	*/
	.factory ('handlerUserlist', function (chatHelpers,userService ) {  
		var userlist = [];
		var singleUser = {};
		return {
			setUsers: function(data)	{
 				userlist = [];
				for (var i in data.users) {
					singleUser = {};
					singleUser.style = '';
					singleUser.name = data.users[i];
					singleUser.index = i;

					if (userService.getUserObj('chatName') === data.users[i]) {
						singleUser.state = 'self';
						singleUser.style = 'online-user-current';	// self
					}
					else 
						if ((userService.isInPrivate) && (userService.isPrivateTo === data.users[i])) {
							singleUser.state = 'privateTo';
							singleUser.style = 'online-user-pm';		// PM
						}
						else {
							singleUser.state = 'norm';
							singleUser.style = 'online-user-norm';	// norm
						}
					userlist.push(singleUser);    
				}
			},
			// used by PM 
			toggleUserState: function(index, state, user){	// name unchanged, but needed
				switch (state)	{
					case 'norm': 		// switch PM ON
						userlist[index].state = 'privateTo'; 		// change property instantly
						userlist[index].style = 'online-user-pm';	// change style instantly
						// call different Service on top here 
						userService.setUserObj('setPrivate',true); 	// the state of the user itself
						userService.setUserObj('privateTo', user);   
					break;
					
					case 'privateTo': 	// switch PM OFF
						userlist[index].state = 'norm'; 		
						userlist[index].style = 'online-user-norm';		
						userService.setUserObj('setPrivate',false); 
						userService.setUserObj('privateTo', ''); 
					break;
					
					default:  	// here 'away' could be applied
				}
			},

			getUsers: function()	{
				return userlist ;
			},
			getUserByIndex: function(index)	{
				return userlist[index];
			},
			resetUserlist: function()	{
				 userlist = [];
			}
		};
	})

	



