/**
 * Current supported wave shapes are:
 * 	'sine' - A basic sine wave
 *
 * Oscillator.js was originally derived from SineWave.js by 0xfe
 * with improvements made to add phase modulation support and
 * future addition of other wave shapes
 *
 */
function Oscillator(context, shape) {
	console.log(context);
	//Context the oscillator is in
	this.context = context;

	// Create an audio node
	this.node = context.createJavaScriptNode(1024, 0, 2);	
	
	// Used to generate waveform shape
	this.phase = 0;
	this.shape = shape;
	this.frequency = 440;	
	this.sampleRate = this.context.sampleRate;
	this.amplitude = 1
	
	// Define: 
	//   workingBuffer for pre-amplified waveform.
	//   outputBufferLeft and outputBufferRight for post-amplified waveform.
	//   phaseModBuffer for phase modulation
	
	this.outputBufferLeft = [];
	this.outputBufferRight = [];	
	
	this.workingBuffer = [];	

	this.phaseModBuffer = [];

	//Phase modulation settings
	this.phaseModAmount = 0;
	
	//@todo Oversampling and filtered decimation for anti-aliasing
	this.overSample = false;
	this.cutoff = 1;
	this.filterBuffer = 0;  
	
	//State variables
	this.playing = false;	

	// Setup audio data callback to generate waveform data
	var $this  = this;
	this.node.onaudioprocess = function(e) { $this.process(e) };
}

/**
 * Getters and setters
 */
 
Oscillator.prototype.setAmplitude = function(amplitude) {
	if (typeof(amplitude) == 'number') {
		this.amplitude = amplitude;
	} else {
		throw 'setAmplitude only accepts numeric values';
	};
}


Oscillator.prototype.setFrequency = function(frequency) {
	if (typeof(frequency) == 'number') {
		this.frequency = frequency;
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
	if (phaseModBuffer.length != this.workingBuffer.length) throw 'Phase Modulation buffer size must be equal to the oscillator buffer size';	
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
		this.outputBufferLeft[i] = this.outputBufferRight[i] = this.workingBuffer[i] * this.amplitude;
		
		//Advance the phase
		this.phase += this.frequency / this.sampleRate + this.calculatePhaseModulation(i);
		
		//Wrap the waveform
		while (this.phase > 1.0) this.phase -= 1;
	}
}

/**
 * Starts the oscillator
 */
Oscillator.prototype.play = function() {
	this.node.connect(this.context.destination);
	this.playing = true;
}

/**
 * Stops the oscillator
 */
Oscillator.prototype.pause = function() {
	this.node.disconnect();
	this.playing = false;
}

/**
 * Calculates the waveform at the current phase
 */
Oscillator.prototype.getSample = function() {
	switch (this.shape) {
		case 'square': 
			return (this.phase > 0.5) ? 1 : 0;			
		break;
		case 'sawtooth': 
			return this.phase;
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
	if ( this.phaseOscillatorAmplitude == 0) return 0;
	if ( this.phaseModBuffer.length != this.workingBuffer.length) return 0;
	return this.phaseModBuffer[offset] * this.phaseModAmount;
}
