delete require.cache[module.filename];	// always reload

const { app, dialog, shell} = require('electron');
const path = require("path");
const fs = require("fs");
const HERE = path.resolve(__dirname);
const sleepless = require("sleepless");

const DS = require("ds").DS;
const configPath = path.resolve(app.getPath("appData"), ".plankton.config.json");
const datastore = new DS(configPath);

if(!datastore.gamesPath)
{
	datastore.gamesPath = path.resolve(app.getPath("documents"), "PlanktonGames");
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
			configPath,
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
		
		let gamePath = path.normalize(datastore.gamesPath + "/" + newGameName.toId());
		fs.mkdir(gamePath, function(error, result)
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
		try
		{
			fs.readdir(datastore.gamesPath, function(error, games)
			{
				if(error)
				{
					fail({message: "Failed to read games directory", action, error, games});
					return false;
				}
				
				console.log(games);
				let gamesList = [];
				games.forEach(function(game)
				{
					gamesList.push({
						name: game,
						label: game.toLabel(),
						path: path.resolve(datastore.gamesPath + "/" + game)
					})
				});
				okay({games:gamesList});
			});
			return true;
		}
		catch(e)
		{
			console.error(e);
		}
		
		return false;
	}
	
	if(action === "getGame")
	{
		const {folder} = input;
		if(!folder)
		{
			fail({message: "No game folder provided"});
			return false;
		}
		
		try
		{
			fs.readdir(path.resolve(datastore.gamesPath, folder), function(error, files)
			{
				if(error)
				{
					fail({message: "Failed to read game directory", action, error, files});
					return false;
				}

				console.log(files);
				let filesList = [];
				files.forEach(function(game)
				{
					filesList.push({
						name: game,
						path: path.resolve(datastore.gamesPath + "/" + game)
					})
				});
				okay({filesList});
				return true;
			});
			return true;
		}
		catch(e)
		{
			console.error(e);
		}
		
	}

	if(action === "openAllGamesFolder")
	{
		const {shell} = require('electron');
		await shell.openPath(path.resolve(datastore.gamesPath));

		okay({message: "success"});
		return true;
	}
	
	if(action === "openGameFolder")
	{
		const {folder} = input;
		if(!folder)
		{
			fail({message: "No game folder provided"});
			return false;
		}

		const {shell} = require('electron');

		//shell.showItemInFolder(folder);
		console.log(folder);
		await shell.openPath(folder);

		okay({message: "success"});
		return true;
	}
	
	if(action === "deleteGame")
	{
		const {folder} = input;
		if(!folder)
		{
			fail({message: "No game folder provided"});
			return false;
		}
		
		fs.rmdir(folder, {recursive: true}, function(error, result)
		{
			if(error)
			{
				fail({message: "Failed when deleting game", error, result, action});
				return false;
			}
			
			okay({message: "success"});
			return true;
		});
		
		return true;
	}

	console.error("--- Action does not exist:\t\t", action);
	fail({message: "Action does not exist", action}, 501);
	
	return false;
};
