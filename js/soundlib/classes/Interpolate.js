/**
 * Set namespaces
 */
var SoundLib = SoundLib || function () {};
var SoundLib.Classes = SoundLib.Classes || {};
var SoundLib.Classes.Interpolate = SoundLib.Classes.Interpolate || {};

/**
 * Define some basic interpolation callbacks.  You may define your own either as
 * an anonymous callback or by extending this class.
 * Interpolation functions take a floating point value between 0 and 1 representing
 * the position between two values.  The start and end values will be modified based
 * on the interpolated position.
 */
(function (I) {
		/**
		 * Returns a linear interpolation
		 */
		I.linear = function (position, start, end) {
			var min = start < end ? start : end
			  , max = start > end ? start : end;
			return min + (max - min) * (position / 1);
		};
	}
})(SoundLib.Classes.Interpolate);