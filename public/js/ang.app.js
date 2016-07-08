angular.module('chatApp', [
	'chatApp.configuration',
	'chatApp.controllers',
	'chatApp.sockethelper',
	'chatApp.services',
	'chatApp.helpers',

	'chatApp.filters',
	'chatApp.directives',
	  //'ngRoute',
	  // 3rd party dependencies
	'btford.socket-io'
]);
