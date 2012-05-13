soundlib.adder = function() {
	// Override these settings to customise behavior
	var settingDefaults = {
		'inputBuffers': [],
		'outputBuffer' : []
	};
	
	// Mix in user defined settings
	for (var key in settingDefaults) {
		if (typeof( settings[key] ) == 'undefined') {
			settings[key] = settingDefaults[key];
		}
	}
}


