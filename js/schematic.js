/**
 * Define underyling audio processing schematic
 */ 
 
var context = new webkitAudioContext();

/**
 * Initialise our two oscillators
 */
var oscillator1 = new Oscillator(context, 'sawtooth');
var oscillator2 = new Oscillator(context, 'sine');

/**
 * Have them phase modulate each other
 */
oscillator1.setPhaseModBuffer( oscillator2.getWorkingBuffer() );
oscillator2.setPhaseModBuffer( oscillator1.getWorkingBuffer() );