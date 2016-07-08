'use strict';

angular.module('chatApp.sockethelper', [ ] )

	.factory('socketRefact', function ($rootScope) {
	  var socket = io.connect();
	  return {
		on: function (eventName, callback) {
		  socket.on(eventName, function () {  
		    var args = arguments;
		    $rootScope.$apply(function () {
		      callback.apply(socket, args);
		    });
		  });
		},
		emit: function (eventName, data, callback) {
		  socket.emit(eventName, data, function () {
		    var args = arguments;
		    $rootScope.$apply(function () {
		      if (callback) {
		        callback.apply(socket, args);
		      }
		    });
		  })
		}
	  };
	})

	.factory('socket', function (socketFactory) {
	    var myIoSocket = io.connect();
	    var socket = socketFactory({
	        ioSocket: myIoSocket
	    });

	    return socket;
	});