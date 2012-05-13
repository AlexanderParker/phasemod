/**
 * Pass a settings object to initialize.  Context is a bare
 * requirement.
 *
 */

function Envelope( settings ) {

	// Override these settings to customise behavior
	var settingDefaults = {
		'context': null,
		'gainNode': null,
		'destination': null, 
		'graph': [
			{
				'time':'0.0',
				'gain':'0.0'
			},
			{
				'time':'0.5',
				'gain':'1.0'
			},
			{
				'time':'2.0',
				'gain':'0.0'
			}
		]
	};
	
	// Mix in user defined settings
	for (var key in settingDefaults) {
		if (typeof( settings[key] ) == 'undefined') {
			settings[key] = settingDefaults[key];
		}
	}	

	// We must have an audio context
	if ( typeof( settings.context ) == 'undefined' || settings.context == null) {
		throw 'Can not initialise envelope: Audio context undefined.';
	} else {
		this.context = settings.context;
	}

	// Determine the destination for the output of the envelope
	if ( typeof( settings.destination ) == 'undefined' || settings.destination == null) {
		// By default, attach the oscillator output to the master output
		this.destination = this.context.destination;
	} else {
		this.destination = settings.destination;
	}

	this.graph = settings.graph;

	// Attach or create gain node
	if ( typeof( settings.gainNode ) == 'undefined' || settings.gainNode == null) {
		this.gainNode = this.context.createGainNode();
	} else {
		this.gainNode = settings.gainNode;
	}
	this.gainNode.connect(this.destination);
	this.gainNode.gain.setValueAtTime(this.graph[0].gain, this.context.currentTime);

	// For consistency...
	this.connectPoint = this.gainNode;	
}

/**
 * Modify the envelope graph
 * Graphs are passed in the form (for a one second ramp up):
 *		[
 *			{
 *				'time':'0.0', //time in seconds
 *				'gain':'0.0'
 *			},
 *			{
 *				'time':'1.0',
 *				'gain':'1.0'
 *			} 
 *		]
 */
Envelope.prototype.setGraph = function( graph ) {
	this.graph = graph;
}

/**
 * Trigger the envelope (graph)
 * Currently only linear ramps are supported
 */
Envelope.prototype.trigger = function() {
	var currentTime = this.context.currentTime;
	this.gainNode.gain.cancelScheduledValues( currentTime );	
	for (i in this.graph) {
		if (i == 0) {
			// Initialise the envelope
			this.gainNode.gain.setValueAtTime(parseFloat(this.graph[i].gain), currentTime);
		} else {
			this.gainNode.gain.linearRampToValueAtTime(parseFloat(this.graph[i].gain) ,currentTime + parseFloat(this.graph[i].time));
		}
	}
}