var SoundLib = SoundLib || {};
var SoundLib.Classes = SoundLib.Classes || {};
var SoundLib.Classes.Waveform = SoundLib.Classes.Waveform || {};

/**
 * Define some basic waveforms.  You may define your own either as
 * an anonymous callback or by extending this class.
 * Waveform functions may accept phase as a parameter.  Phase can be
 * between 0 and 1 - behavour outside this range is not supported.
 */
SoundLib.Classes.Waveform = {
		/**
		 * Returns a random sample - phase is not used
		 */
		random: function () {			
			return Math.random();
		}
		/**
		 * Generates a square sample (AKA pulse with equal width) 
		 * 
		 * _--_--_--
		 *
		 */		
		, square: function (phase) { 
			return phase > 0.5) ? 1 : 0;
		}
		/**
		 * Generates a sawtooth sample 
		 *
		 * /|/|/|
		 *
		 */
		, saw: function (phase) {
			return phase;
		}
		/**
		 * Generates an inversed sawtooth sample 
		 * 
		 * |\|\|\
		 *
		 */
		, inversedSaw: function (phase) {
			return 1.0 - phase;
		}
		/**
		 * Generates a triangle sample 
		 *
		 * /\/\/\
		 *
		 */
		, triangle: function (phase) {
			return (phase > 0.5) ? 1.0 - ((phase - 0.5) * 2) : phase * 2;
		}
		/**
		 * Generates a sine sample 
		 *
		 * <wavy line>
		 *		 
		 */		
		, sine: function (phase) {
			return Math.sin( phase * Math.PI * 2.0 );
		}
	}
}