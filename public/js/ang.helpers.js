'use strict';

angular.module('chatApp.helpers', [])
	.service ('chatHelpers', function () {
		return {
			// format a UNIX  timestring to HH:MM 
			formatTime: function(time) {
				var t = new Date(time);
				var tString = '';
				if (t.getHours() < 10 )
					tString += '0'
				tString += t.getHours();
				tString +=':';		
				if (t.getMinutes() < 10 )
					tString += '0'
				tString += t.getMinutes();
				return tString;
			}
	 	};
	})

