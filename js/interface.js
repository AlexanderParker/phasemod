$(document).ready( function() {
	
	//Oscillator 1
	
	$('#play1').click(start1);

	function start1() {
		synthesizer.oscillator[0].play();
		$('#play1').text("Stop");
		$('#play1').click(stop1);
	}

	function stop1() {
		synthesizer.oscillator[0].pause();
		$('#play1').text("Start");
		$('#play1').click(start1);
	}
	
	$("#frequency1").knobRot({
		classes: ['knob1'],
		minimumValue: 1,
		maximumValue: 2048,
		frameCount: 21,
		dragMultiplier: 15, 
		hideInput: true,		
		callback: function() {
			synthesizer.oscillator[0].setFrequency($("#frequency1").knobRot('getvalue'));
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
			synthesizer.oscillator[0].setAmplitude($("#amplitude1").knobRot('getvalue'));
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
	
	//Oscillator 2
	
	$('#play2').click(start2);

	function start2() {
		synthesizer.oscillator[1].play();
		$('#play2').text("Stop");
		$('#play2').click(stop2);
	}

	function stop2() {
		synthesizer.oscillator[1].pause();
		$('#play2').text("Start");
		$('#play2').click(start2);
	}	
	
	$("#frequency2").knobRot({
		classes: ['knob1'],
		minimumValue: 1,
		maximumValue: 2048,
		frameCount: 21,
		dragMultiplier: 15, 
		hideInput: true,		
		callback: function() {
			synthesizer.oscillator[1].setFrequency($("#frequency2").knobRot('getvalue'));
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
			synthesizer.oscillator[1].setAmplitude($("#amplitude2").knobRot('getvalue'));
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
});