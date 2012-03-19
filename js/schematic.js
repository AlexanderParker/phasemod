/**
 * Define underyling audio processing schematic
 */ 
 
var context = new webkitAudioContext();

/**
 * Initialise our two oscillators
 */
var oscillator1 = new Oscillator(context, 'sine');
var oscillator2 = new Oscillator(context, 'sine');

/**
 * Have them phase modulate each other (tee hee hee)
 */
 
 oscillator1.setPhaseOscillator( oscillator2 );
 oscillator2.setPhaseOscillator( oscillator1 );