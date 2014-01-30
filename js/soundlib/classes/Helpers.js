/**
 * Set namespaces
 */
var SoundLib = SoundLib || function () {};
var SoundLib.Classes.Helpers = SoundLib.Classes.Helpers || {};

(function(C) {
	/**
	 * Useful for extending settings with options
	 */
	C.extend = function(settings, options) {
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
	C.log = function(message) {
		if (typeof console !== 'undefined' && typeof console.log !== 'undefined') {
			console.log(message);
		}
	};	
})(SoundLib.Classes.Helpers);