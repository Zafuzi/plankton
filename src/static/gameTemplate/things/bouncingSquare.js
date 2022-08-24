let squareImage = assets["data/Icon.png"];
let square = new Squid( vec(200, 200), squareImage, 0, 1, 0.5);

console.log(squareImage)

square.velocity = vec(2, 2);

square.listen("tick", function()
{
	if(square.position.x + (squareImage.w * square.scale / 2) > canvas.width || square.position.x < 0)
	{
		square.velocity.x *= -1;
	}

	if(square.position.y + (squareImage.h * square.scale / 2) > canvas.height || square.position.y < 0)
	{
		square.velocity.y *= -1;
	}
});