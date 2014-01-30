var SoundLib = SoundLib || {};
var SoundLib.Prototypes = SoundLib.Prototypes || {};
var SoundLib.Prototypes.Gain = SoundLib.Prototypes.Gain || {};

/**
 * Getters and setters
 */ 
p.setGain = function(gain) {
	if (typeof(gain) == 'number') {
		//Apply gain smoothing to prevent pops and clicks
		var currentTime = this.context.currentTime;
		this.gainNode.gain.cancelScheduledValues( currentTime );		
		this.gainNode.gain.setTargetValueAtTime(gain, currentTime, 0.02);
		this.gain = gain;	
	} else {
		throw 'setGain only accepts numeric (float) values';
	};
}