delete require.cache[module.filename];

const {dialog} = require("electron");

const Module = require("./rpc_module");
const fs = require("fs");
const path = require("path");
const sleepless = require("sleepless");
const {copyDir} = require("./fs_extra");

const L = sleepless.L.mkLog("--- Games\t\t")(3);

class GameModule extends Module
{
	constructor(_input, _datastore, _okay, _fail)
	{
		super(_input, _datastore, _okay, _fail);
	}
	getGamesPath()
	{
		let self = this;

		L.V(self.datastore.gamesPath);
		self.okay({ path: self.datastore.gamesPath });
		return true;
	}
	
	getAllGames()
	{
		let self = this;

		fs.readdir(self.datastore.gamesPath, function(error, games)
		{
			if(error)
			{
				self.fail({message: "self.failed to read games directory", action: self.action, error, games});
				return false;
			}

			L.V(sleepless.o2j(games));
			let gamesList = [];
			games.forEach(function(game)
			{
				gamesList.push({
					name: game,
					label: game.toLabel(),
					path: path.resolve(self.datastore.gamesPath + "/" + game)
				})
			});
			self.okay({games:gamesList});
		});
		return true;
	}
	async openGameFolder()
	{
		let self = this;
		
		const {folder} = self.input;
		if(!folder)
		{
			self.fail({message: "No game folder provided"});
			return false;
		}

		const {shell} = require('electron');

		//shell.showItemInFolder(folder);
		L.V(folder);
		await shell.openPath(folder);

		self.okay({message: "success"});
		return true;
	}

	async openAllGamesFolder()
	{
		let self = this;
		
		const {shell} = require('electron');
		await shell.openPath(path.resolve(self.datastore.gamesPath));

		self.okay({message: "success"});
		return true;
	}

	async changeGamesPath()
	{
		let self = this;
		
		let folder = await dialog.showOpenDialog({ properties: ['openDirectory'] });
		L.V(folder);
		if(!folder.canceled)
		{
			self.datastore.gamesPath = folder.filePaths[0];
			self.datastore.save();

			self.okay({
				path: folder
			});

			return true;
		}
		else
		{
			self.fail({message: "self.failed to pick a folder", action: self.action});
			return false;
		}
	}

	deleteGame()
	{
		let self = this;

		const {folder} = self.input;
		if(!folder)
		{
			self.fail({message: "No game folder provided"});
			return false;
		}

		fs.rm(folder, {recursive: true, force: true}, function(error, result)
		{
			if(error)
			{
				self.fail({message: "self.failed when deleting game", error, result, action: self.action});
				return false;
			}

			self.okay({message: "success"});
			return true;
		});

		return true;
	}

	async createGame()
	{
		let self = this;

		let {newGameName} = self.input;

		if(!newGameName)
		{
			self.fail({message: "Empty game name", action: self.action});
			return false;
		}

		let gamePath = path.resolve(self.datastore.gamesPath + "/" + newGameName.toId());
			
		if(fs.existsSync(gamePath))
		{
			self.fail({message: "Path already exists!", action: self.action});
			return false;
		}
		
		try{
			let gameTemplatePath = path.resolve(__dirname, "../static/gameTemplate");
			let gameCreated = await copyDir(gameTemplatePath, gamePath);
			self.okay({message: "success", path: gamePath});
		}
		catch(e)
		{
			self.fail({message: "Failed to copy the gameTemplate", action: self.action, error: e});
			return false;
		}
	}
	
}

module.exports = GameModule;