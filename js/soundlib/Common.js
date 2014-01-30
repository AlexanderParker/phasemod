var SoundLib = SoundLib || {};
var SoundLib.Common = SoundLib.Common || {};

(function(C) {
	/**
	 * Initialises common library components
	 */
	var init = function() {	
		include('js/soundlib/prototypes/Context.js');
		include('js/soundlib/prototypes/Envelope.js');		
		include('js/soundlib/prototypes/Gain.js');
		include('js/soundlib/prototypes/Oscillator-0.1.0.js');
		include('js/soundlib/Interface.js');
		include('js/soundlib/Schematic.js');
	}
		
	/**
	 * Simple function to include other scripts - uses script tag
	 */
	var include = function(path) {
		var js = document.createElement("script");
		js.type = "text/javascript";
		js.src = path;
		document.body.appendChild(js);
	};

	/**
	 * Useful for extending settings with options
	 */
	var extend = function(settings, options) {
		// Mix in user defined settings
		for (var key in options) {
			if (options.hasOwnProperty(key)) {
				settings[key] = options[key];
			}
		}
	};

	/**
	 * Basic log wrapper.  May add sugar as needed.
	 */
	var log = function(message) {
		if (typeof console !== 'undefined' && typeof console.log !== 'undefined') {
			console.log(message);
		}
	};	
}(SoundLib.Common));