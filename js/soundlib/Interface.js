$(document).ready( function() {
	
	//Oscillator 1

	var keysDown = [];
	
	var freqRange = 1024;

	$("#frequency1").knobRot({
		classes: ['knob1'],
		minimumValue: 0 - freqRange,
		maximumValue: freqRange,
		frameCount: 21,
		dragMultiplier: 15, 
		hideInput: true,		
		callback: function() {
			synthesizer.oscillator[0].setFrequencyOffset(parseFloat($("#frequency1").knobRot('getvalue')));
		}
	});

	$("#amplitude1").knobRot({
		classes: ['knob1'],		
		minimumValue: 0,
		maximumValue: 2,
		frameCount: 21,
		dragMultiplier: 0.01,
		hideInput: true,		
		callback: function() {
			synthesizer.oscillator[0].setGain($("#amplitude1").knobRot('getvalue'));
		}
	});
	
	$("#modsend1").knobRot({
		classes: ['knob1'],		
		minimumValue: 0,
		maximumValue: 1,
		frameCount: 21,
		dragMultiplier: 0.005,
		hideInput: true,
		callback: function() {
			synthesizer.oscillator[0].setPhaseModAmount($("#modsend1").knobRot('getvalue'));
		}
	});  			
	
	$("#frequency2").knobRot({
		classes: ['knob1'],
		minimumValue: 0 - freqRange,
		maximumValue: freqRange,
		frameCount: 21,
		dragMultiplier: 5, 
		hideInput: true,		
		callback: function() {
			synthesizer.oscillator[1].setFrequencyOffset(parseFloat($("#frequency2").knobRot('getvalue')));
		}
	});

	$("#amplitude2").knobRot({
		classes: ['knob1'],		
		minimumValue: 0,
		maximumValue: 2,
		frameCount: 21,
		dragMultiplier: 0.01,
		hideInput: true,		
		callback: function() {
			synthesizer.oscillator[1].setGain($("#amplitude2").knobRot('getvalue'));
		}
	}); 
	
	$("#modsend2").knobRot({
		classes: ['knob1'],		
		minimumValue: 0,
		maximumValue: 1,
		frameCount: 21,		
		dragMultiplier: 0.005,
		hideInput: true,		
		callback: function() {
			synthesizer.oscillator[1].setPhaseModAmount($("#modsend2").knobRot('getvalue'));
		}
	}); 

	/*
	 * Set up keyboard mapping
	 */	
	$('body').keydown(function(e) {
		var frequency = 0;
		if (keysDown[e.which]) return;
		keysDown[e.which] = true;
		switch (e.which) {
			case 81: //C4
				frequency = 261.626;
			break;
			case 50: //C#4
				frequency = 277.183;
			break;			
			case 87: //D4
				frequency = 293.665;
			break;	
			case 51: //D#4
				frequency = 311.127;
			break;			
			case 69: //E4
				frequency = 329.628;
			break;	
			case 82: //F4
				frequency = 349.228;
			break;	
			case 53: //F#4
				frequency = 369.994;
			break;
			case 84: //G4
				frequency = 391.995;
			break;
			case 54: //G#4
				frequency = 415.305;
			break;
			case 89: //A4
				frequency = 440.000;
			break;
			case 55: //A#4
				frequency = 466.164;
			break;
			case 85: //B4
				frequency = 493.883;
			break;
			case 73: //C5
				frequency = 523.251;
			break;	
			case 57: //C#5
				frequency = 554.365;
			break;
			case 79: //D5
				frequency = 587.330;
			break;	
			case 48: //D#5
				frequency = 622.254;
			break;
			case 80: //E5
				frequency = 659.255;
			break;					
		}
		if (frequency > 0) {
			for (i in synthesizer.oscillator) {
				synthesizer.oscillator[i].setFrequency(frequency);				
			}
			synthesizer.masterEnvelope.trigger();
		}
	}).keyup(function(e){
		keysDown[e.which] = false;
	});
});
