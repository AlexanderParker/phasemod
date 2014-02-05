
var SoundLib = SoundLib || {};

SoundLib.Context = function() {
	// SoundLib.Context is a Class wrapper around 
	// non-standard AudioContext constructor
	return new AudioContext() || new webkitAudioContext();
}
