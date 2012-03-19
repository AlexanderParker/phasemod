/**
 * Current supported wave shapes are:
 * 	'sine' - A basic sine wave 
 */
function Oscillator(context, shape) {
	
	//Context the oscillator is in
	this.context = context;

	// Create an audio node
	this.node = context.createJavaScriptNode(128, 0, 1);	
	
	// Used to generate waveform shape
	this.phase = 0;
	this.shape = shape;
	this.frequency = 440;	
	this.sampleRate = this.context.sampleRate;
	this.amplitude = 1;
	this.buffer = null;

	//Phase modulation settings
	this.phaseOscillator = null; 
	this.phaseOscillatorAmplitude = 0;
	
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

/*
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

Oscillator.prototype.setPhaseOscillator = function(phaseOscillator) {
	if (typeof(phaseOscillator) == 'object') {
		console.log();
		this.phaseOscillator = phaseOscillator; 
	}
}

Oscillator.prototype.setPhaseOscillatorAmount = function(phaseOscillatorAmount) {
	if (typeof(frequency) == 'number') {
		this.phaseOscillatorAmount = phaseOscillatorAmount;
	} else {
		throw 'setPhaseOscillatorAmount only accepts numeric values';	
	}
}

Oscillator.prototype.process = function(e) {
	this.buffer = e.outputBuffer.getChannelData(0);
	for (var i = 0; i < this.buffer.length; i++) {
		this.buffer[i] = this.getSample();;
		/** @todo make this patchable **/
		//var phaseMod = this.phaseOffset * Math.PI * 2.0;
		this.phase += this.frequency / this.sampleRate ;//+ phaseMod;
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
 * Retrieves the appropriate sample for the configured waveform and the 
 * current phase offset
 */
Oscillator.prototype.getSample = function() {
return this.amplitude * Math.sin( this.phase * Math.PI * 2.0 );
	switch (this.shape) {
		case 'sine':
		default: 
			return this.amplitude * Math.sin( this.phase * Math.PI * 2.0 );
		break;
	}
}
