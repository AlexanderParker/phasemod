/**
 * Set namespaces
 */
var SoundLib = SoundLib || function() {};
var SoundLib.Prototypes = SoundLib.Prototypes || {};
var SoundLib.Prototypes.Context = SoundLib.Prototypes.Context || function() {};

/**
 * Define the constructor
 */	
SoundLib.Prototypes.Context = function() {
	// @todo add x-broser support as it becomes available
	this.audioContext = new AudioContext() || new webkitAudioContext();
}

/**
 * Retrieve the audio context
 */
SoundLib.Prototypes.Context.prototype.getContext = function() {
	return this.audioContext();
}
