/**
 * Define underyling audio processing schematic
 */ 
 
var context = new soundlib();
soundlib.init();
/**
 * Initialise our two oscillators
 */
var oscillator1 = new soundlib.oscillator(context, 'triangle');
var oscillator2 = new soundlib.oscillator(context, 'sine');

/**
 * Have them phase modulate each other
 */
oscillator1.setPhaseModBuffer( oscillator2.getWorkingBuffer() );
oscillator2.setPhaseModBuffer( oscillator1.getWorkingBuffer() );
