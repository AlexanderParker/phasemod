var SoundLib = SoundLib || {};
var SoundLib.Prototypes = SoundLib.Prototypes || {};
var SoundLib.Prototypes.Context = SoundLib.Prototypes.Context || {};

function soundlib() {
	this.audioContext = null;
	this.debugMode = false;
}

soundlib.prototype.init = function() {
	this.audioContext = new webkitAudioContext();
}
