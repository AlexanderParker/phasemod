$(document).ready( function() {
	
	//Oscillator 1
	
	$('#play1').click(start1);

	function start1() {
		oscillator1.play();
		$('#play1').text("Stop");
		$('#play1').click(stop1);
	}

	function stop1() {
		oscillator1.pause();
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
			oscillator1.setFrequency($("#frequency1").knobRot('getvalue'));
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
			oscillator1.setAmplitude($("#amplitude1").knobRot('getvalue'));
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
			oscillator1.setPhaseOscillatorAmount($("#modsend1").knobRot('getvalue'));
		}
	});  			
	
	//Oscillator 2
	
	$('#play2').click(start2);

	function start2() {
		oscillator2.play();
		$('#play2').text("Stop");
		$('#play2').click(stop2);
	}

	function stop2() {
		oscillator2.pause();
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
			oscillator2.setFrequency($("#frequency2").knobRot('getvalue'));
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
			oscillator2.setAmplitude($("#amplitude2").knobRot('getvalue'));
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
			oscillator2.setPhaseOscillatorAmount($("#modsend2").knobRot('getvalue'));
		}
	});  			
});