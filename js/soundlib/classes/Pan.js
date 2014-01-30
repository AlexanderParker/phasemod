/**
 * Set namespaces
 */
var SoundLib = SoundLib || function () {};
var SoundLib.Classes = SoundLib.Classes || {};
var SoundLib.Classes.Pan = SoundLib.Classes.Pan || {};

/**
 * Define some basic pan mechanisms.  You may define your own either as
 * an anonymous callback or by extending this class.
 * Pan functions may accept pan offset as a parameter.  Pan can be
 * between 0 (left) and 1 (right) with 0.5 generally being center
 */
(function (P) {
		/**
		 * Returns a linear pan
		 */
		P.linear = function (pan) {
			return pan;
		};
	}
})(SoundLib.Classes.Pan);