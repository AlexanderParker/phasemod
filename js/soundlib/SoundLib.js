/**
 * Set namespaces
 */
var SoundLib = SoundLib || function() {};

/**
 * Define the constructor
 */	 
SoundLib = function() {
	// Load classes
	this.include('js/soundlib/classes/Helpers.js');
	this.include('js/soundlib/classes/Pan.js');
	this.include('js/soundlib/classes/Waveform.js');
	// Load prototypes
	this.include('js/soundlib/prototypes/Context.js');
	this.include('js/soundlib/prototypes/Oscillator.js');		
	//helpers.include('js/soundlib/prototypes/Envelope.js');		
	// include('js/soundlib/prototypes/Gain.js');
	// include('js/soundlib/Interface.js');
	// include('js/soundlib/Schematic.js');
}

/**
 * Simple function to include other scripts - uses script tag
 */
SoundLib.prototype.include = function(path) {
	var js = document.createElement("script");
	js.type = "text/javascript";
	js.onload = function () {
		document.body.appendChild(js);
	}
	js.src = path;
};
