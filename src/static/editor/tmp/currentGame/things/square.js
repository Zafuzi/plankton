let square = PIXI.Sprite.from("data/Icon.png");
let plink = assets["data/plink.ogg"];

/** USER GENERATED CODE BLOCK **/
square.start = function()
{
	// user generated code
	square.x = 24;
	
	square.xdir = 3;
	square.ydir = 3;
	
	square.scale.x = 0.3;
	square.scale.y = 0.3;
}

square.update = function()
{
	// user generated code
	square.x += this.xdir;
	square.y += this.ydir;
	
	plink.stereo(square.x / engine.view.width);

	if(this.x + this.width > engine.view.width || this.x < 0)
	{
		this.xdir *= -1;
		plink.play();
	}
	
	if(this.y + this.height > engine.view.height || this.y < 0)
	{
		this.ydir *= -1;
		plink.play();
	}
}
/** END USER GENERATED CODE BLOCK **/

// uses the name / id of the entity
assets["square"] = square;