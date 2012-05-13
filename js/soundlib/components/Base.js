function soundlib() {
	this.audioContext = null;
	this.debugMode = false;
}

soundlib.prototype.init = function() {
	this.audioContext = new webkitAudioContext();
}
