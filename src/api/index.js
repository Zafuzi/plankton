delete require.cache[module.filename];	// always reload

module.exports = function(input, _okay, _fail)
{
	const {action} = input;

	check(action, "string");

	console.log(action);

	if(action === "ping")
	{
		return _okay("pong");
	}

	_fail();
};

const check = function(object, type)
{
	return typeof object === type;
};
