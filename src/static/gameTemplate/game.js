let pixiApp = new PIXI.Application({width: 800, height: 600});

let images, sounds, assets = {};
let startup = sleepless.runq();

// get config
startup.add(function(next)
{
	loadConfig(function(content)
	{
		images = content.images || [];
		sounds = content.sounds || [];
		things = content.things || [];
		
		next();
	});
})

// load sprites
startup.add(function(next)
{
	let loader = sleepless.runq();
	
	loader.add(function(loaderNext)
	{
		for(let i = 0; i < images.length; i++)
		{
			let image = images[i];
			assets[image] = PIXI.Sprite.from(image);
			// pixiApp.stage.addChild(assets[image]);
		}
		
		loaderNext();
	});
	
	loader.add(function(loaderNext)
	{
		for(let i = 0; i < things.length; i++)
		{
			let thing = things[i];
			
			loadThing(thing);
		}
		
		loaderNext();
	});
	
	loader.run(function()
	{
		next();
	});
});

// append canvas and start engine
startup.run(function()
{
	console.log("Ready for trouble...");
	document.body.appendChild(pixiApp.view);
	
	// Add a variable to count up the seconds our demo has been running
	let elapsed = 0.0;
	// Tell our application's ticker to run a new callback every frame, passing
	// in the amount of time that has passed since the last tick
	pixiApp.ticker.add((delta) => {
		// Add the time to our total elapsed time
		elapsed += delta;
		// Update the sprite's X position based on the cosine of our elapsed time.  We divide
		// by 50 to slow the animation down a bit...
		//sprite.x = 100.0 + Math.cos(elapsed/50.0) * 100.0;
	});
});

