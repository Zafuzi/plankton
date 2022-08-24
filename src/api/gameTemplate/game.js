document.addEventListener("DOMContentLoaded", function()
{
	console.log("HELLO GAME TEMPLATE");
	loadThing("test");
});

const loadThing = function(thingName)
{
	let script = document.createElement("script");
	script.src = `things/${thingName}.js`;

	document.body.appendChild(script);
}