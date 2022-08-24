const loadConfig = function(callback)
{
	fetch("./config.json").then(r => r.json()).then(function(json)
	{
		if(callback instanceof Function)
		{
			callback(json);
		}
	});
}

const loadThing = function(thingName)
{
	let script = document.createElement("script");
	script.src = `things/${thingName}.js`;

	document.body.appendChild(script);
}
