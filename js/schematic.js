/**
 * Define underyling audio processing schematic
 */ 
 
var context = new webkitAudioContext();
var oscillator1 = new Oscillator(context, 'sine');
var oscillator2 = new Oscillator(context, 'sine');