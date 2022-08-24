let square = new Squid( vec(10, 10) );

square.velocity = vec(2, 2);

square.listen("tick", function()
{
	if(square.position.x + 100 > canvas.width || square.position.x < 0)
	{
		square.velocity.x *= -1;
	}

	if(square.position.y + 100 > canvas.height || square.position.y < 0)
	{
		square.velocity.y *= -1;
	}
});

square.listen("draw", function()
{
	fill_rect(square.position.x, square.position.y, 100, 100, "red");
});
