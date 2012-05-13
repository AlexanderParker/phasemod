document.ready = function() {
	var basepath = 'js/soundlib';
	include(basepath + '/components/Base.js');
	include(basepath + '/components/Oscillator-0.1.0.js');
	include(basepath + '/components/Adder.js');
	include(basepath + '/components/Envelope.js');	
	include(basepath + '/Interface.js');
	include(basepath + '/Schematic.js');
	function include(path) {
		var js = document.createElement("script");
		js.type = "text/javascript";
		js.src = path;
		document.body.appendChild(js);
	}
}

soundlibLog = function(msg) {
	console.log(msg);
}
