/**
 * Set namespaces
 */
var SoundLib = SoundLib || function () {};

/**
 * Define the constructor
 *
 * Pass a options object to initialize.  Context is a bare
 * requirement.
 */
SoundLib.Envelope = function (options) {
	// Override these settings to customise behavior
	this.settings = {
		// We need an audio context to determine buffer properties
		bufferLength: 2048,
		// Does this envelope sustain?
		sustain: true,
		// Start point of the sustain loop
		sustainStart: 1,
		// End point of the sustain loop
		sustainEnd: 2,
		// Should the loop ping-pong
		pingPong: true,
		// Total length in seconds, not counting sustain
		length: 1,
		// Interpolation callback
		interpolation: SoundLib.Classes.Interpolate.linear,
		// Points in time that make up the envelope level			
		points: [{
        			'time': '0.0',
        			'level': '0.0'
        		}, {
        			'time': '0.2',
        			'level': '1.0'
        		}, {
        			'time': '0.8',
        			'level': '0.0'
        		}, {
        		    'time': '1.0',
        			'level': '0.0'
        	    }]
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
SoundLib.Envelope.prototype.validateBufferSize = function () {

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
SoundLib.Envelope.prototype.sync = function () {
	this.offset = 0;
	this.flushBuffer();
};

SoundLib.Envelope.prototype.getBuffer = function () {
	return this.buffer;
};

/**
 * Flushes (zeros out) the buffer
 */
SoundLib.Envelope.prototype.flushBuffer = function () {	
    var newBuffer = new Array(this.settings.bufferLength), 
        offset = this.settings.bufferLength;
        
    while (--offset >= 0) {
        newBuffer[offset] = 0;
    }
    
    this.buffer = newBuffer;
};

/**
 * Modify the envelope points
 */
SoundLib.Envelope.prototype.setGraph = function (graph) {
	this.settings.points = points;
}

/**
 * Trigger the envelope (graph)
 * Currently only linear ramps are supported
 */
Envelope.prototype.trigger = function() {

	if (this.wait) { 
		setTimeout(function() {
		    this.trigger('test')
		}.bind(this)), 5); 
		return;
	}

	//Cancel previously sceduled events
	this.gainNode.gain.cancelScheduledValues( this.context.currentTime );

	var smoothingTime = 0.03;

	for (var i in this.graph) {
		if (i === 0) {
			// Initialise the envelope (smoothly)
			this.gainNode.gain.setTargetValueAtTime(parseFloat(this.graph[i].gain), this.context.currentTime, smoothingTime);
		} else {
			this.gainNode.gain.linearRampToValueAtTime(parseFloat(this.graph[i].gain) ,this.context.currentTime + parseFloat(this.graph[i].time) + smoothingTime);
		}
	}
}
