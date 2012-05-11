document.ready = function() {
	var basepath = 'js/soundlib';
	include(basepath + '/components/base.js');
	include(basepath + '/components/oscillator.js');
	include(basepath + '/components/adder.js');
	include(basepath + '/interface.js');
	include(basepath + '/schematic.js');
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
