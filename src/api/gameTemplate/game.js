const TEMPLATE_VERSION = 0.1;

splash_ticks = 10;
debug = true;

document.addEventListener("DOMContentLoaded", function()
{
	console.log(TEMPLATE_VERSION);
	loadThing("bouncingSquare");
});

const loadThing = function(thingName)
{
	let script = document.createElement("script");
	script.src = `things/${thingName}.js`;

	document.body.appendChild(script);
}