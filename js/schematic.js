/**
 * Define underyling audio processing schematic
 */ 

var audioContext = new webkitAudioContext();

var synthesizer = new schematic( audioContext );

function schematic( context ) {

	// Initialise our two oscillators
	this.oscillatorSettings = {
		'context': audioContext,
		'shape': 'sine'
	}

	// Some basic settings
	this.oscillator = [];
	this.oscillatorAmount = 2;
	
	// Initialise two oscillators
	for (var i = 0; i < this.oscillatorAmount; i++) {
		this.oscillator[i] = new Oscillator( this.oscillatorSettings );
	}

	// Have them phase modulate each other, hacked in here for now,
	// @todo create a proper modulation matrix
	this.oscillator[0].setPhaseModBuffer( this.oscillator[1].getWorkingBuffer() );
	this.oscillator[1].setPhaseModBuffer( this.oscillator[0].getWorkingBuffer() );	
}