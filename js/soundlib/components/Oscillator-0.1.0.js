/**
 * Pass a settings object to initialize.  Context is a bare
 * requirement.
 *
 *
 * Oscillator.js was originally based on SineWave.js by 0xfe
 * with many chages made to add phase modulation support and
 * future addition of other wave shapes.
 *
 * http://0xfe.blogspot.com.au/2011/08/generating-tones-with-web-audio-api.html
 *
 */
 
function Oscillator( settings ) {	
	
	// Override these settings to customise behavior
	var settingDefaults = {
		'context': null,

		'destination': null,
		
		// Current supported wave shapes are:
		// 'sine',  'whitenoise',  'square',  'sawtooth' and  'triangle' 		
		'shape': 'sine',
		'buffer': 1024,
		'frequency': 261.625565, //Middle C
		'frequencyOffset': 0,
		'gain': '1',
		
		// You can provide a reference to another audio buffer to modulate this
		// oscillator against
		'modulator': [],
		
		// Shape mapping is used to map integer values to waveforms
		// with the array offset defining the integer to map the shape to
		'shapeMapping': ['sine', 'triangle', 'sawtooth', 'square', 'whitenoise'],

		'envelope': null

	};
	
	// Mix in user defined settings
	for (var key in settingDefaults) {
		if (typeof( settings[key] ) == 'undefined') {
			settings[key] = settingDefaults[key];
		}
	}
	
	// We must have an audio context
	if ( typeof( settings.context ) == 'undefined' || settings.context == null) {
		throw 'Can not initialise oscillator: Audio context undefined.';
	} else {
		this.context = settings.context;
	}

	// Determine the destination for the output of this node
	if ( typeof( settings.destination ) == 'undefined' || settings.destination == null) {
		// By default, attach the oscillator output to the master output
		this.destination = this.context.destination;
	} else {
		this.destination = settings.destination;
	}

	// Buffer length must be valid
	// https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html#JavaScriptAudioNode-section
	if (!(
		settings.buffer == 256
		|| settings.buffer == 512
		|| settings.buffer == 1024
		|| settings.buffer == 2048
		|| settings.buffer == 4096
		|| settings.buffer == 8192
		|| settings.buffer == 16384
	)) {
		throw 'Invalid buffer length of ' + settings.buffer + ' specified for oscillator.  Must be one of  256, 512, 1024, 2048, 4096, 8192 or 16384 according to spec: https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html#JavaScriptAudioNode-section';
	}
	
	// Create the audio node
	this.node = this.context.createJavaScriptNode(settings.buffer, 0, 2);

	// Used to generate waveform shape
	this.phase = 0;
	this.shape = settings.shape;
	this.frequency = settings.frequency;
	this.nextFrequency = settings.frequency;	
	this.frequencyOffset = settings.frequencyOffset;	
	this.sampleRate = this.context.sampleRate;
	this.gain = settings.gain;
	this.envelope = settings.envelope;

	// Attach a gain node
	this.gainNode = this.context.createGainNode();
	this.gainNode.connect(this.destination);
	this.gainNode.gain.setValueAtTime(this.gain, this.context.currentTime);

	// For consistency...
	this.connectPoint = this.gainNode;

	// Define: 
	//   workingBuffer for pre-amplified waveform.
	//   outputBufferLeft and outputBufferRight for post-amplified waveform.
	this.outputBufferLeft = [];
	this.outputBufferRight = [];		
	this.workingBuffer = [];	

	//Phase modulation settings
	this.phaseModAmount = 0;
	
	//The phase modulation buffer can be provided if phase modulation is desired
	this.setPhaseModBuffer(settings.modulator);
	
	//@todo Oversampling and filtered decimation for anti-aliasing
	this.overSample = false;
	this.cutoff = 1;
	this.filterBuffer = 0;  
	
	//State variables
	this.playing = false;	

	// Setup audio data callback to generate waveform data
	var $this  = this;
	this.node.onaudioprocess = function(e) { $this.process(e) };

	// Attach the node to its output via the audio gain
	this.node.connect(this.gainNode);
}

/**
 * Getters and setters
 */
 
Oscillator.prototype.setGain = function(gain) {
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


Oscillator.prototype.setFrequency = function(frequency) {
	if (typeof(frequency) == 'number') {
		if (this.envelope != null) this.envelope.wait = true;		
		this.nextFrequency = frequency;
	} else {
		throw 'setFrequency only accepts numeric values';
	};
}

Oscillator.prototype.setFrequencyOffset = function(frequencyOffset) {
	if (typeof(frequencyOffset) == 'number') {
		this.frequencyOffset = frequencyOffset;
	} else {
		throw 'setFrequency only accepts numeric values';
	};
}

Oscillator.prototype.getWorkingBuffer = function() {
	return this.workingBuffer;	
}

Oscillator.prototype.getOutputBuffer = function() {
	return this.outputBuffer;
}

/**
 * Assigns a buffer to modulate the phase of this oscillator
 */
Oscillator.prototype.setPhaseModBuffer = function( phaseModBuffer ) {
	if (typeof(phaseModBuffer) != 'object') throw 'Phase Modulation buffer type mistmatch.';
	if (phaseModBuffer.length != this.workingBuffer.length && phaseModBuffer.length != 0) throw 'Phase Modulation buffer size must be equal to the oscillator buffer size';	
	this.phaseModBuffer = phaseModBuffer; 
}

/**
 * Sets the amount by which the phase oscillator modulates this oscillator
 */
Oscillator.prototype.setPhaseModAmount = function(phaseModAmount) {
	if (typeof(phaseModAmount) == 'number') {
		this.phaseModAmount = phaseModAmount;
	} else {
		throw 'phaseModAmount only accepts numeric values';	
	}
}

Oscillator.prototype.process = function(e) {
	
	//Initialise the buffer	
	this.outputBufferLeft = e.outputBuffer.getChannelData(0);
	this.outputBufferRight = e.outputBuffer.getChannelData(1);	
	for (var i = 0; i < this.outputBufferLeft.length; i++) {
	
		//Calculate the raw waveform
		this.workingBuffer[i] = this.getSample();
		
		//Process the raw waveform
		this.outputBufferLeft[i] = this.outputBufferRight[i] = this.workingBuffer[i];
		
		//Advance the phase
		this.phase += (this.frequency + this.frequencyOffset) / this.sampleRate + this.calculatePhaseModulation(i);
		
		//Wrap the waveform
		while (this.phase > 1.0) {
			this.phase -= 1;
			this.frequency = this.nextFrequency;
			if (this.envelope != null) this.envelope.wait = false;				
		}
	}
}

/**
 * Starts the oscillator
 */
Oscillator.prototype.play = function() {
	this.setGain(1);
	this.playing = true;
}

/**
 * Stops the oscillator
 */
Oscillator.prototype.mute = function() {
	this.setGain(0);
	this.playing = false;
}

/**
 * Calculates the waveform at the current phase
 */
Oscillator.prototype.getSample = function() {
	switch (this.shape) {
		case 'whitenoise': 
			return Math.random();
		break;
		case 'square': 
			return (this.phase > 0.5) ? 1 : 0;			
		break;
		case 'sawtooth': 
			return this.phase;
		break;		
		case 'triangle': 
			return (this.phase > 0.5) ? 1.0 - ((this.phase - 0.5) * 2) : this.phase * 2;
		break;		
		case 'sine':
		default: 
			return Math.sin( this.phase * Math.PI * 2.0 );
		break;
	}
}

/**
 * Calculates the phase modulation offset
 */ 
Oscillator.prototype.calculatePhaseModulation = function( offset ) {	
	if ( this.phaseModBuffer.length == 0) return 0;	
	if ( typeof(this.phaseModBuffer) != 'object' ) return 0;
	if ( this.phaseModAmount == 0) return 0;
	if ( this.phaseModBuffer.length != this.workingBuffer.length) return 0;
	return this.phaseModBuffer[offset] * this.phaseModAmount;
}

/**
 * Allow hard phase syncing (reset phase to 0)
 */
 Oscillator.prototype.phaseReset = function() {
 	this.phase = 0;
 }