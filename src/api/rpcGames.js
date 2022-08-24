delete require.cache[module.filename];

const sleepless = require("sleepless");
const {dialog, shell} = require("electron");
const fs = require("fs");
const path = require("path");
const L = sleepless.L.mkLog("--- games\t\t")(5);

let datastore;
let input;
let action;
let okay;
let fail;

const methods = {
	getGamesPath()
	{
		okay({ path: datastore.gamesPath });
		return true;
	},
	
	getAllGames()
	{
		fs.readdir(datastore.gamesPath, function(error, games)
		{
			if(error)
			{
				fail({message: "Failed to read games directory", action, error, games});
				return false;
			}

			L.I(sleepless.o2j(games));
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
	},
	
	getGame()
	{
		const {folder} = input;
		if(!folder)
		{
			fail({message: "No game folder provided"});
			return false;
		}

		fs.readdir(path.resolve(datastore.gamesPath, folder), function(error, files)
		{
			if(error)
			{
				fail({message: "Failed to read game directory", action, error, files});
				return false;
			}

			L.I(sleepless.o2j(files));
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
	},
	
	async openGameFolder()
	{
		const {folder} = input;
		if(!folder)
		{
			fail({message: "No game folder provided"});
			return false;
		}

		const {shell} = require('electron');

		//shell.showItemInFolder(folder);
		L.I(folder);
		await shell.openPath(folder);

		okay({message: "success"});
		return true;
	},
	
	async openAllGamesFolder()
	{
		const {shell} = require('electron');
		await shell.openPath(path.resolve(datastore.gamesPath));

		okay({message: "success"});
		return true;
	},
	
	async changeGamesPath()
	{
		let folder = await dialog.showOpenDialog({ properties: ['openDirectory'] });
		L.I(folder);
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
			fail({message: "Failed to pick a folder", action: input.action});
			return false;
		}
	},
	
	deleteGame()
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
	},
	
	createGame()
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
}

module.exports = {
	run: async function(_input, _datastore, _okay, _fail)
	{
		input = _input;
		action = _input.action;
		datastore = _datastore;
		okay = _okay;
		fail = _fail;
		
		if(!action || !input || !datastore || !(okay instanceof Function) || !(fail instanceof Function))
		{
			_fail({message: "failed to instantiate games rpc"}, 500);
			return false;
		}
		
		if(methods[action] instanceof Function)
		{
			methods[action]();
			return true;
		}
		
		_fail({message: "Method not found", action});
		return false;
	},
}
