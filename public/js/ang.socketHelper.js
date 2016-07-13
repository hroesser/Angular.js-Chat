'use strict';

angular.module('chatApp.sockethelper', [ ] )
	.factory('btfordSocket', function (socketFactory) {
	    var myIoSocket = io.connect();
	    var socket = socketFactory({
	        ioSocket: myIoSocket
	    });
	    return socket;
	});