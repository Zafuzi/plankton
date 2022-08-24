let startup = sleepless.runq();

let TEMPLATE_VERSION = 0.1;
let images;
let sounds;
let things;

let screen = vec(800, 600);
let titleFont = load_font("Arial", 30, "#F09D28");
let assets = {};

startup.add(function(next)
{
	loadConfig(function(content)
	{
		console.log(content);
		
		images = content?.images || [];
		sounds = content?.sounds || [];
		things = content?.things || [];
		
		TEMPLATE_VERSION = content?.templateVersion || "0.0.1";
		
		console.log(`TEMPLATE VERSION: ${TEMPLATE_VERSION}`);
		next();
	});
});

startup.add(function(next)
{
	console.log(images, sounds, things);

	// title/loading screen
	let title = new Thing();
	let load_progress = 0;
	let load_file = "";

	title.listen( "draw_4", ( mouse_x, mouse_y ) => {
		if( load_progress < 1.0 ) {
			draw_text( "Tidepool", screen.x * 0.5, screen.y * 0.5 - 15, titleFont, "center", 0.4 );
			draw_text( "Loading: "+round(load_progress * 100)+"% "+load_file, screen.x * 0.5 + 15, screen.y * 0.4, titleFont, "center", 0.5 );
		} else  {
			draw_text( "Tidepool", screen.x * 0.5, screen.y * 0.5 - 15, titleFont, "center", 1 );
			draw_text( "Click to Start ", screen.x * 0.5, screen.y * 0.5 + 15, titleFont, "center", 1 );

			load_file = "";
		}
	} );

	load_assets( images, sounds, ( progress, file, asst, type ) => {

		load_progress = progress;
		load_file = file;
		assets[ file ] = asst;

		console.log( load_progress+"% "+type+" "+file );
		if( load_progress >= 1.0 ) {
			title.listen( "mousedown", () => {
				title.destroy();	// destroy the title page
				debug = true;
				next();
			});
		}

	}, console.error );

	tick( true ); // turn on ticking; tick handlers will be called
});

startup.add(function(next)
{
	things.forEach(function(thing)
	{
		loadThing(thing);
	});
});

startup.run();