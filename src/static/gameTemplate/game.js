let engine = new PIXI.Application({width: 1280, height: 720});

let images, sounds, assets = {};
let startup = sleepless.runq();
let things;

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
});

// load sprites, sounds, and things
startup.add(function(next)
{
	let loader = sleepless.runq();

	loader.add(function(loaderNext)
	{
		let imageLoader = sleepless.runp();

		for(let i = 0; i < images.length; i++)
		{
			let image = images[i];

			imageLoader.add(function(imageLoaderNext)
			{
				loadImage(image, function(loadedImage)
				{
					assets[image] = loadedImage;
					imageLoaderNext();
				}, function(error)
				{
					console.error("Failed to load: " + image, error);
					imageLoaderNext();
				});
			});
		}

		imageLoader.run(function()
		{
			loaderNext();
		});
	});

	loader.add(function(loaderNext)
	{
		let soundLoader = sleepless.runp();

		for(let i = 0; i < sounds.length; i++)
		{
			let sound = sounds[i];

			soundLoader.add(function(soundLoaderNext)
			{
				loadSound(sound, function(loadedSound)
				{
					assets[sound] = loadedSound;
					soundLoaderNext();
				}, function(error)
				{
					console.error("Failed to load: " + sound, error);
					soundLoaderNext();
				});
			});
		}

		soundLoader.run(function()
		{
			loaderNext();
		});
	});

	// ALL IMAGES AND SOUNDS SHOULD BE READY BY NOW
	loader.add(function(loaderNext)
	{
		let thingLoader = sleepless.runp();

		for(let i = 0; i < things.length; i++)
		{
			let thing = things[i];

			thingLoader.add(function(thingLoaderNext)
			{
				loadThing(thing, thingLoaderNext);
			});
		}

		thingLoader.run(function()
		{
			loaderNext();
		});
	});

	loader.run(function()
	{
		next();
	});
});

let elapsed = 0.0;
// append canvas and start engine
startup.run(function()
{
	console.log("Ready for trouble...");
	document.body.appendChild(engine.view);

	Object.values(assets).forEach(asset =>
	{
		if(asset.start instanceof Function)
		{
			asset.start();
			engine.stage.addChild(asset);
		}
	});

	elapsed = 0.0;
	engine.ticker.add((delta) =>
	{
		elapsed += delta;
		Object.values(assets).forEach(asset =>
		{
			if(asset.update instanceof Function)
			{
				asset.update();
			}
		});
	});
});

