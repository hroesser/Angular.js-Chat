'use strict';

angular.module('chatApp.directives', [])


/*** directive divUser
**** pass through scope vars:  user.name,user.state,user.index
**** called by user joins, leaves, private Message, state change ('away' ...)
* user: '@' 		a string property 'name' passed to dir.
* user: '='			2way Databinding on 'name'
* action: '&'		can invoke external fn.: scope { action: ‘&’ }

					<div ng-repeat="user in participants.users">
						<!-- chatter div-user  callback-controller="togglePm(arg1,arg2,arg3)" ></chatter-->
						<chatter div-user user="user" ></chatter>
					</div>
 * fiddle: http://jsfiddle.net/ycBFL/342/
*/

// <chatter div-user user="user"  callback-controller="togglePm(name,state,index)"   ></chatter>
.directive('divUser', function()		{
	return {
	    restrict: 'A',
	   	link: link,
		scope: { 
			//	now call the corresponding fn in our DIR <chatter> which calls the main controller 
			callCtrl: '&callbackController',
			user: '=user',
		},
		// ng-click calls the link fn., belongs to THIS scope
		template: '<div class="{{user.style}}" ><div class="circle-header14" ></div>'
			+'<span ng-click="toggleState(user.name,user.state,user.index)"'
			+ '>{{user.name}}</span></div>',

	}               
	function link( scope, elem, attrs ) {
	    scope.toggleState  = function(name,state,idx) {
			//	callback to THIS scope
	        scope.callCtrl({name: name, state: state, index: idx});
	    }

    }
})



//	<div speaker callback-controller="toggleSound(switchTo)" sound="on" ></div>
.directive('speaker', function()	{
	return {
	    restrict: 'A',
	   	link: link,
		scope: { 
			callCtrlFn: '&callbackController'
		},
		template: '<div class="sound" >'
				+'<span id="speaker" ng-click="toggleSnd()" class="sound-on" title="mute"></span>'
				+'</div>',

	}   
	function link( scope, elem, attrs ) {
	    scope.toggleSnd  = function() {
			//	call the main controller d-on t object
			var rootElem 	= elem;
			var mySpan 		= rootElem.children(0).children(0) ; // fetches <span id="speaker" ..>
			var curClass 	= mySpan.attr("class");  // should 'sound-on" 'YUP
			var curSoundState = rootElem.attr("sound");  // !! not from <span>  

			if (curSoundState == 'on')	{	// Muting
				mySpan.attr('class','sound-off') ;
				mySpan.attr('title','play') ;
				rootElem.attr('sound','off');
				scope.callCtrlFn( {switchTo: 'mute' });  // call callback fn in <div speaker> which calls ctrl. fn
				console.log('## dir: togl sound OFF cc '+ curClass  + ' st '  + curSoundState	);
			} else {
				mySpan.attr('class','sound-on') ;	// sw. Sound ON 
				mySpan.attr('title','mute') ;
				rootElem.attr('sound','on');
				scope.callCtrlFn( {switchTo: 'play' });
 				console.log('## dir: togl sound ON cc '+ curClass  + ' st  ' + curSoundState	);
			}
	    }
    }
})