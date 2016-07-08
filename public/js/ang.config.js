'use strict';

angular.module('chatApp.configuration', [ ] )
	.constant('appConf', {
		maxChatMessages: 45,
		maxServerMessages: 10,
		minChatCharacter: 4
	});
