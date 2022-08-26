let loaded_images = [];
let loaded_things = [];
let loaded_sounds = [];

const NOP = () => {};

const loadConfig = function(callback)
{
	fetch("./game.config.json").then(r => r.json()).then(function(json)
	{
		if(callback instanceof Function)
		{
			callback(json);
		}
	});
}

const loadThing = function(thingName, next)
{
	let script = document.createElement("script");
	script.src = `${thingName}.js`;
	
	script.onload = next;
	
	loaded_things.push(script);
	document.body.appendChild(script);
}

// load and return an image object given its path.
const loadImage = function(path, okay = NOP, fail = NOP) {
	let e = document.createElement( "img" );
	e.src = path;
	e.style.display = "none";
	e.onload = function() {
		let img = {
			w: e.width,
			h: e.height,
			data: e,
			smoothing: true,
		};
		img.size = {w: img.w, h: img.h};
		e.remove();	// remove from DOM - not needed anymore
		loaded_images.push(img);
		okay(img);
	};
	e.onerror = function(err) {
		fail(err);
	};
	document.body.appendChild(e);	// add image to DOM so it will load
};

// load and return a sound object given its path.
const loadSound = function(path, okay = NOP, fail = NOP) {
	let snd = new Howl({
		src: [ path ],
		onload: () => {
			loaded_sounds.push(snd);
			okay( snd );
		},
		onloaderror: err => {
			fail( err );
		},
	});
	loaded_sounds.push( snd );
};
