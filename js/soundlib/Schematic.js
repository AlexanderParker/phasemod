/**
 * Define underyling audio processing schematic
 */

function schematic( ) {
	
	this.context = new webkitAudioContext();

	// Create a master envelope
	var defaultGraph = [
		{
			'time': '0.0',
			'gain': '0.0'
		},
		{
			'time': '0.02',
			'gain': '1.0'
		},
		{
			'time': '0.1',
			'gain': '0.3'
		},
		{
			'time': '1.0',
			'gain': '0.0'
		}
	];

	var envelopeSettings = {
		'context': this.context,
		'graph': defaultGraph
	}

	this.masterEnvelope = new Envelope(envelopeSettings);	

	// Some basic settings
	this.oscillator = [];
	this.oscillatorAmount = 2;

	// Initialise our two oscillators
	this.oscillatorSettings = {
		'context': this.context,
		'shape': 'sine',
		'destination': this.masterEnvelope.connectPoint,
		'envelope': this.masterEnvelope
	}	

/**
		// Attach a gain node
		this.gainNode = this.context.createGainNode();
		this.gainNode.connect(this.destination);
		this.gainNode.gain.setValueAtTime(this.gain, this.context.currentTime);

!!! attach a gain node to the context destination

**/
	// Initialise two oscillators
	for (var i = 0; i < this.oscillatorAmount; i++) {
		this.oscillator[i] = new Oscillator( this.oscillatorSettings );
		this.oscillator[i].play();
	}

	// Have them phase modulate each other, hacked in here for now,
	// @todo create a proper modulation matrix
	this.oscillator[0].setPhaseModBuffer( this.oscillator[1].getWorkingBuffer() );
	this.oscillator[1].setPhaseModBuffer( this.oscillator[0].getWorkingBuffer() );
}

synthesizer = new schematic();