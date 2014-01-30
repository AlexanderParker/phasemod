/**
 * Set namespaces
 */
var SoundLib = SoundLib || function () {};
var SoundLib.Prototypes = SoundLib.Prototypes || {};
var SoundLib.Prototypes.Envelope = SoundLib.Prototypes.Envelope || function () {};

/**
 * Define the constructor
 *
 * Pass a settings object to initialize.  Context is a bare
 * requirement.
 */
SoundLib.Prototypes.Envelope = function (options) {
	// Override these settings to customise behavior
	this.settings = {
		// We need an audio context to determine buffer properties
		bufferLength: 2048
		// Does this envelope sustain?
		, sustain: true
		// Start point of the sustain loop
		, sustainStart: 1
		// End point of the sustain loop
		, sustainEnd: 2
		// Should the loop ping-pong
		, pingPong: true
		// Total length in seconds, not counting sustain
		, length: 1
		// Interpolation callback
		, interpolation: SoundLib.Classes.Interpolate.linear
		// Points in time that make up the envelope level			
		, points: [
			{
				'time': '0.0'
				, 'level': '0.0'
			}
			, {
				'time': '0.2'
				, 'level': '1.0'
			}
			, {
				'time': '0.8'
				, 'level': '0.0'
			}
			, {
				'time': '1.0'
				, 'level': '0.0'
			}
		]
	};
	// Extend the default settings
	SoundLib.Classes.Helpers.extend(this.settings, options);
	// Validate the audio context
	this.validateAudioContext();
	// Sync the envelope (reset offset to 0)
	this.bufferOffset = 0;
	// Create a buffer to store the generated envelope values
	this.buffer = [];
};

/**
 * Check that the current buffer size is valid
 */
p.validateBufferSize = function () {
	// Buffer length must be valid
	// https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html#JavaScriptAudioNode-section
	var validBuffers = [256, 512, 1024, 2048, 8192, 16384];
	if ( validBuffers.indexOf(this.settings.bufferLength) === -1) {
		throw 'Invalid buffer length of '
			+ this.settings.bufferLength
			+ ' specified for oscillator.  Must be one of  256, 512, 1024, 2048, 4096, 8192 or 16384'
			+ ' according to spec: https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html#JavaScriptAudioNode-section';
	}
};

/**
 * Resets the envelope offset to 0
 */
SoundLib.Prototypes.Envelope.prototype.sync = function () {
	this.offset = 0;	
};

/**
 * Flushes (zeros out) the buffet
 */
SoundLib.Prototypes.Envelope.prototype.flushBuffer = function() {
    var rv = new Array(len);
    while (--len >= 0) {
        rv[len] = val;
    }
    return rv;
}

/**
 * Modify the envelope points
 */
Envelope.prototype.setGraph = function( graph ) {
	this.settings.points = points;
}

/**
 * Trigger the envelope (graph)
 * Currently only linear ramps are supported
 */
Envelope.prototype.trigger = function() {

	var that = this;
	if (this.wait) { 
		setTimeout(function(){that.trigger('test')}, 5); 
		return;
	}

	//Cancel previously sceduled events
	this.gainNode.gain.cancelScheduledValues( this.context.currentTime );

	var smoothingTime = 0.03;

	for (i in this.graph) {
		if (i == 0) {
			// Initialise the envelope (smoothly)
			this.gainNode.gain.setTargetValueAtTime(parseFloat(this.graph[i].gain), this.context.currentTime, smoothingTime);
		} else {
			this.gainNode.gain.linearRampToValueAtTime(parseFloat(this.graph[i].gain) ,this.context.currentTime + parseFloat(this.graph[i].time) + smoothingTime);
		}
	}
}