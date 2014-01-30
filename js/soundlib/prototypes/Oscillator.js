var SoundLib = SoundLib || {};
var SoundLib.Prototypes = SoundLib.Prototypes || {};
var SoundLib.Prototypes.Oscillator = SoundLib.Prototypes.Oscillator || {};

/**
 * Provides an audio oscillator 
 */ 
(function(constructor) {
	/**
	 * Define the constructor
	 *
	 * Pass an options object to override default settings.
	 *
	 * (Audio Context is a minimum settings requirement.)	
	 */
	constructor = function (options) {
		this.settings = {
			// Audio context (provided by web audio API)
			context: null
			// Smaller buffers reduce latency, size must be a power of 2 between 256 and 16384 inclusive
			, bufferLength: 2048
			// "Middle C"
			, frequency: 261.625565
			// Can be used to detune oscillators.  See also setFrequencyOffset
			, frequencyOffset: 0
			// Takes a callback to calculate a waveform.  See SoundLib.Classes.Waveform for examples
			, waveformCalculator: SoundLib.Classes.Waveform.sine
			// Takes a callback to calculate panning.  See SoundLib.Classes.Pan for examples
			, panCalculator: SoundLib.Classes.Pan.linear
			// Set the zero-crossing threshold.  Smaller values will find crossings closer to zero but may miss some crossings
			, zeroThreshold = 0.02
			// Whether or not to wait for zero crossings before changing frequency (some waveforms may never cross zero)
			, waitForZeroCrossing = true
		};
		// Extend settings with provided options
		SoundLib.Common.extend(this.settings, options);
		// Ensure we have a proper audio context
		this.validateAudioContext();
		// Make sure the buffer size is valid
		this.validateBufferSize();
		// Create the node used to generate audio
		this.createGeneratorNode();
		// Reset oscillator phase to 0
		this.sync();
		// Set the frequency (performs some range checks etc)
		this.setFrequency(settings.frequency);
		// workingBuffer for pre-amplified and panned waveform.
		this.workingBuffer = [];			
		// outputBufferLeft and outputBufferRight for post-amplified and panned waveform.
		this.outputBufferLeft = [];
		this.outputBufferRight = [];		
		// pre-calculate zero crossing threshold to reduce real-time processing overhead
		this.zeroMin = 0.5 - this.settings.zeroThreshold;
		this.zeroMax = 0.5 + this.settings.zeroThreshold;
		// Setup audio data callback to generate waveform data
		this.generatorNode.onaudioprocess = this.process.bind(this);
	};	
	/**
	 * Assign p to this class's prototype for easier assignment
	 */
	var p = constructor.prototype;	
	/**
	 * Sets the waveform to the passed callback (see SoundLib.Classes.Waveform for examples)
	 */
	p.setWaveformCalculator = function (callback) {
		if (typeof callback === 'function' && typeof callback(0.5) === 'number') {
			this.settings.waveformCalculator = callback;
		} else {
			throw "Unable to assign callback as waveform calculator.  It's either not a callback or it doesn't generate numbers."
		}
	};
	/**
	 * Sets the waveform to the passed callback (see SoundLib.Classes.Waveform for examples)
	 */
	p.setPanCalculator = function (callback) {
		if (typeof callback === 'function' && typeof callback(0.5) === 'number') {
			this.settings.panCalculator = callback;
		} else {
			throw "Unable to assign callback as pan calculator.  It's either not a callback or it doesn't generate numbers."
		}
	};
	/**
	 * Pass a boolean to set whether or not to wait for zero crossings before frequency shifts
	 */
	p.setWaitForZeroCrossing = function (shouldWait) {
		if (typeof shouldWait === 'boolean') {
			this.settings.waitForZeroCrossing = shouldWait;
		} else {
			throw 'shouldWait must be a boolean';
		}		
	}
	/**
	 * Creates the node used to generate waveform audio
	 */
	p.createGeneratorNode = function () {
		return this.generatorNode = this.context.createJavaScriptNode(this.settings.bufferLength, 0, 2);
	};
	/**
	 * Resets the phase to sync the oscillator to various events.
	 */
	p.sync = function () {
		this.phase = 0;
	};
	p.validateBufferSize = function () {
		// Buffer length must be valid
		// https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html#JavaScriptAudioNode-section
		if (!(
			this.settings.bufferLength == 256
			|| this.settings.bufferLength == 512
			|| this.settings.bufferLength == 1024
			|| this.settings.bufferLength == 2048
			|| this.settings.bufferLength == 4096
			|| this.settings.bufferLength == 8192
			|| this.settings.bufferLength == 16384
		)) {
			throw 'Invalid buffer length of ' + this.settings.bufferLength + ' specified for oscillator.  Must be one of  256, 512, 1024, 2048, 4096, 8192 or 16384 according to spec: https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html#JavaScriptAudioNode-section';
		}
	};
	p.validateAudioContext = function () {
		// We must have an audio context
		if ( typeof this.settings.context === 'undefined' || this.settings.context === null ) {
			throw 'Can not initialise oscillator: Audio context is null or undefined.';
		}		
	};
	/**
	 * Calculates the waveform at the current phase
	 */
	p.getSample = function () {
		return this.waveformCalculator.apply(this, this.phase);
	};
	/**
	 * Sets the oscillator frequency in hertz
	 */
	p.setFrequency = function (frequency) {
		this.validateFrequency(frequency);
		// We don't immediately set the frequency, 
		// to prevent pops and clicks wait for zero crossing
		this.nextFrequency = frequency;
	};
	p.validateFrequency = function (frequency) {
		if (typeof(frequency) === 'number') {
			if (frequency < 0) {
				throw "Negative frequency is out of bounds";
			}
		} else {
			throw 'setFrequency only accepts numeric values';
		};
	};
	/**
	 * Offset the frequency by a fixed amount
	 */
	p.setFrequencyOffset = function (frequencyOffset) {
		if (typeof(frequencyOffset) == 'number') {
			this.settings.frequencyOffset = frequencyOffset;
		} else {
			throw 'setFrequency only accepts numeric values';
		};
	}
	/**
	 * Retrieve the so-called "working" buffer - that is
	 * the state of the buffer prior to any processing such as phase modulation
	 * and panning
	 */
	p.getWorkingBuffer = function () {
		return this.workingBuffer;	
	}
	/**
	 * Retrieve the output buffer - that is the state of the buffer after to any 
	 * processing such as phase modulation and panning
	 */
	p.getOutputBuffer = function () {
		return this.outputBuffer;
	}
	/**
	 * Assigns a buffer to modulate the phase of this oscillator
	 * Any buffer (such as the buffer of another oscillator ) can be used as long as it is of
	 * equal length to this oscillator's buffer.
	 */
	p.setPhaseModulator = function (buffer) {
		if (typeof(buffer) != 'object') {
			throw 'Phase Modulation buffer type mistmatch.';
		}
		if (buffer.length != this.workingBuffer.length) {
			throw 'Phase Modulation buffer size must be equal to the oscillator buffer size';
		}
		this.phaseModBuffer = buffer; 
	}
	/**
	 * Calculates the next buffer segment thus generating the audio waveform
	 * Caution: Called during real time audio buffer processing - avoid heavy processing
	 */ 
	p.process = function (e) {	
		//Initialise the buffer	
		this.outputBufferLeft = e.outputBuffer.getChannelData(0);
		this.outputBufferRight = e.outputBuffer.getChannelData(1);	
		//Get the current frequency
		var currentFrequency = this.getOffsetFrequency();
		for (var i = 0; i < this.outputBufferLeft.length; i++) {		
			//Calculate the raw waveform
			this.workingBuffer[i] = this.getSample();
			if (this.crossingZero()) {
				this.frequency = this.nextFrequency;
			}
			//Process the raw waveform
			this.outputBufferLeft[i] = this.outputBufferRight[i] = this.workingBuffer[i];			
			//Advance the phase (apply modulation, if any)
			this.phase += (currentFrequency) / this.context.sampleRate + this.getPhaseModulation(i);			
			//Wrap the waveform to keep between 0 and 1
			while (this.phase > 1.0) {
				this.phase -= 1;
			}
		}
	};
	/**
	 * Knowing when a sample is close to zero is good for things like preventing clicks during
	 * processing.  In this case, "Zero" is actually 0.5 - halfway between 0 and 1.
	 */
	p.isCrossingZero = function () {
		return this.workingBuffer[i] > this.zeroMin && this.workingBuffer < this.zeroMax;
	}
	p.getOffsetFrequency = function() {
		return (frequency = this.settings.frequency + this.settings.frequencyOffset) > 0 ? frequency : 0;
	}
	/**
	 * Calculates the phase modulation offset
	 * Caution: Called during real time audio buffer processing - avoid heavy processing
	 */ 
	p.getPhaseModulation = function ( offset ) {	
		if ( 
			typeof this.phaseModBuffer  === 'object'
			&& this.phaseModBuffer.length === this.workingBuffer.length 
		) {
			return this.phaseModBuffer[offset];
		}
		return 0;
	}
})(SoundLib.Classes.Oscillator);