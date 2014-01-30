/**
 * Set namespaces
 */
var SoundLib = SoundLib || function () {};
var SoundLib.Prototypes = SoundLib.Prototypes || {};
var SoundLib.Prototypes.Gain = SoundLib.Prototypes.Gain || function () {};

/**
 * Define the constructor
 */
SoundLib.Prototypes.Gain = function(options) {
	this.settings = {
		// Audio context (provided by web audio API)
		context: null
		// The gain
		, gain: 1
		// Smoothing time (prevents pops and clicks).  Lower values make faster transitions.
		, smoothingTime: 0.02
	};
	SoundLib.Classes.Helpers.extend(this.settings, options);
 	this.gainNode = this.context.createGainNode();  
 	// Prime the gain with the initial value  
    this.gainNode.gain.setValueAtTime(this.settings.gain, this.context.currentTime);
};

/**
 * Add a destination to output the stream to (like the master context's destination)
 */
SoundLib.Prototypes.Gain.addDestination = function(destination) {
	this.gainNode.connect(destination);
};

/**
 * Set the gain
 */ 
SoundLib.Prototypes.Gain.setGain = function(gain) {
	if (typeof gain  === 'number') {
		//Apply gain smoothing to prevent pops and clicks
		this.gainNode.gain.cancelScheduledValues(this.context.currentTime);
		this.gainNode.gain.setTargetValueAtTime(gain, this.context.currentTime, this.settings.smoothingTime);
		this.settings.gain = gain;	
	} else {
		throw 'setGain only accepts numeric (float) values';
	};
}

/**
 * Retrieves the gain node for direct manipulation if desired
 */
SoundLib.Prototypes.Gain.getGainNode = function () {
	return this.gainNode;
}