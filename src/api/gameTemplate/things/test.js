let sq = new Squid( vec(10, 10) );

sq.listen("draw", function()
{
	fill_rect(sq.position.x, sq.position.y, 100, 100, "red");
});