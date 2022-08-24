
let homeQueue = sleepless.runq();

// get games path
homeQueue.add(function(next)
{
	let r8_gamesPath = sleepless.rplc8("#gamesPath");
	sleepless.rpc("/api/", {action: "getGamesPath"}, function(response)
	{
		if(!response.data?.path)
		{
			console.error("missing path from data object", response);
		}
		else
		{
			r8_gamesPath.update({path: response.data?.path || ""});
		}
		
		console.log("Config path: ", response.data.configPath);
		next();
	}, function()
	{
		console.error("There was an error fetching the games path");
		next();
	});
});

// get games list
homeQueue.add(function(next)
{
	let r8_gamesList = sleepless.rplc8("#gamesList");
	sleepless.rpc("/api/", {action: "getAllGames"}, function(response)
	{
		if(!response.data?.games)
		{
			console.error("missing games list from data object", response);
		}
		else
		{
			r8_gamesList.update(response.data.games, function(instance, data)
			{
				instance.addEventListener("click", function(event)
				{
					// debounce clicking on buttons
					if(event.target.dataset?.name)
					{
						window.location.href = `/editor?gameName=${data.name}`;
					}
				});
			});
		}
		next();
	}, function()
	{
		console.error("There was an error fetching the games path");
		next();
	});
});

// setup changing the games path
homeQueue.add(function(next)
{
	let changeGamesPathButton = sleepless.QS1("#changeGamesPath");
	
	changeGamesPathButton?.addEventListener("submit", function(event)
	{
		event.preventDefault();
		sleepless.rpc("/api/", {action: "changeGamesPath"}, function()
		{
			window.location.reload();
		}, function(error, data)
		{
			console.error("Failed to change game path: ", error);
		});
	});
	
	next();
	return true;
});

// setup creating a new "game"
// TODO add the ability to MANAGE the games (play, open folder in filesystem, and delete)
// TODO clone the default game template when creating
homeQueue.add(function(next)
{
	let newGameForm = sleepless.QS1("#newGameForm");
	let newGameFormError = sleepless.rplc8("#newGameFormError");
	
	newGameForm.addEventListener("submit", function(event)
	{
		event.preventDefault();
		
		newGameFormError.update({error: ""});
		
		let newGameName = sleepless.QS1("#newGameName")?.value;
			newGameName = newGameName.toId();
			
		if(!newGameName)
		{
			console.error("You failed to provide a new game name!");
			return false;
		}
		
		sleepless.rpc("/api/", {action: "createGame", newGameName}, function(response)
		{
			if(response?.data?.error)
			{
				newGameFormError.update({error: sleepless.o2j(response.data.error)});
				return false;
			}
			
			window.location.reload();
		}, function(error)
		{
			newGameFormError.update({error: sleepless.o2j(error)});
			console.error(error);
		});
	});
	
	next();
	return true;
});

homeQueue.run(function()
{
	console.log("Welcome home dear...");
});