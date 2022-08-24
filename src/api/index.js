delete require.cache[module.filename];	// always reload

const { dialog } = require('electron');
const path = require("path");
const fs = require("fs");
const HERE = path.resolve(__dirname);
const sleepless = require("sleepless");

const DS = require("ds").DS;
const datastore = new DS(path.resolve(HERE + "/config.json"));

if(!datastore.gamesPath)
{
	datastore.gamesPath = path.resolve(process.env.USERPROFILE + "\\Documents\\PlanktonGames");
	datastore.save();
}
const DEFAULT_GAMES_DIR = datastore.gamesPath;

module.exports = async function(input, _okay, _fail)
{
	const {action} = input;
	
	const okay = function(data)
	{
		_okay({ status: 200, data });
	}
	
	const fail = function(data, statusCode)
	{
		_fail({ status: statusCode || 400, data });
	}

	if(!action)
	{
		fail("Action not provided");
		return false;
	}

	if(action === "ping")
	{
		okay("pong");
		return true;
	}
	
	if(action === "getGamesPath")
	{
		okay({
			path: DEFAULT_GAMES_DIR
		});
		return true;
	}
	
	if(action === "changeGamesPath")
	{
		let folder = await dialog.showOpenDialog({ properties: ['openDirectory'] });
		console.log(folder);
		if(!folder.canceled)
		{
			datastore.gamesPath = folder.filePaths[0];
			datastore.save();
			
			okay({
				path: folder
			});
			
			return true;
		}
		else
		{
			fail({message: "Failed to pick a folder", action});
			return false;
		}
	}
	
	if(action === "createGame")
	{
		let {newGameName} = input;
		
		if(!newGameName)
		{
			fail({message: "Empty game name", action});
			return false;
		}
		
		fs.mkdir(datastore.gamesPath + "/" + newGameName.toId(), function(error, result)
		{
			if(error)
			{
				fail({message: "Failed to create game", error, action, result});
				return false;
			}
			
			okay({message: "success"});
			return true;
		});
		
		return true;
	}
	
	if(action === "getAllGames")
	{
		let games = fs.readdirSync(datastore.gamesPath);
		console.log(games);
		let gamesList = [];
		games.forEach(function(game)
		{
			gamesList.push({
				name: game,
				path: path.resolve(datastore.gamesPath + "/" + game)
			})
		});
		okay({games:gamesList});
		return true;
	}

	console.error("--- Action does not exist:\t\t", action);
	fail({message: "Action does not exist", action}, 501);
	
	return false;
};

const check = function(object, type)
{
	return typeof object === type;
};
