/*! simpleClock v1.0 | (c) 2012, 2016 TICKTOO Systems GmbH - https://ticktoo.com | MIT License */

/*
---------------- JS ----------------

    $(document).ready(function() {
      $('#clock').simpleClock();
    });    

--------------- HTML ---------------

    <div id="clock">
      <div id="time">
        <span class="hour"></span>
        <span class="minute"></span>
        <span class="second"></span>
      </div>
      <div id="date"></div>
    </div>
    
------------------------------------    
*/

(function($) {

	$.fn.simpleClock = function(setLang) {
		var lang = setLang;// 'en';  // 'de', ...
		var weekdays = {};
		var months  = {};

		weekdays.de = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
		months.de = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
		weekdays.en = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		months.en = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

		//var curWeekdays = weekdays[lang];
		//console.log( ' en weekdays: ' + JSON.stringify( curWeekdays ) ) ;


		// getTime - The Gathering
		function getTime() {
			var date = new Date(),
				hour = date.getHours();
			return {
				day: weekdays[lang][date.getDay()],
				date: date.getDate(),
				month: months[lang][date.getMonth()],
				hour: appendZero(hour),
				minute: appendZero(date.getMinutes()),
				//second: appendZero(date.getSeconds())
			};
		}

		// appendZero - If the number is less than 10, add a leading zero. 
		function appendZero(num) {
			if (num < 10) {
				return "0" + num;
			}
			return num;
		}

		// refreshTime - Build the clock.		Monday, May 23.  
		function refreshTime() {
			var now = getTime();
			var date = { 
					'en': now.day + ', ' + now.month + ' ' + now.date + '.' ,
					'de': now.day + ', ' + now.date + '. ' + now.month  
			};
			$('#date').html(date[lang]);

			// 24h format all langs
			$('#time').html("<span class='hour'>" + now.hour + ":</span>" + "<span class='minute'>" + now.minute + "</span>" );
		}

		// Tick tock - Run the clock.
		refreshTime();
		setInterval(refreshTime, 1000);

	};
})(jQuery);
