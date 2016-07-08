'use strict';

// das Helper Modul definieren
angular.module('chatApp.helpers', [])
	.service ('chatHelpers', function () {
		return {
			// ein Helper, der aus dem Timestring ein Date macht, dann nach HH:MM formatiert
			formatTime: function(time) {
				var t = new Date(time);
				var tString = '';
				if (t.getHours() < 10 )
					tString+= '0'
				tString+= t.getHours();
				tString+=':';		
				if (t.getMinutes() < 10 )
					tString+= '0'
				tString+= t.getMinutes();
				return tString;
			}
	 	};
	})

