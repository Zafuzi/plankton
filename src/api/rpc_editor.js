delete require.cache[module.filename];

const Module = require("./rpc_module");
const fs = require("fs");
const path = require("path");
const sleepless = require("sleepless");
const L = sleepless.L.mkLog("--- Editor\t\t")(5);

class EditorMethods extends Module
{
	
	constructor(_input, _datastore, _okay, _fail)
	{
		super(_input, _datastore, _okay, _fail);
	}
	
	getGame()
	{
		let self = this;
		
		L.I(sleepless.o2j(self.input));

		const {folder} = self.input;
		if(!folder)
		{
			self.fail({message: "No game folder provided"});
			return false;
		}

		fs.readdir(path.resolve(self.datastore.gamesPath, folder), function(error, files)
		{
			if(error)
			{
				self.fail({message: "self.failed to read game directory", action: self.action, error, files});
				return false;
			}

			L.I(sleepless.o2j(files));
			let filesList = [];
			files.forEach(function(game)
			{
				filesList.push({
					name: game,
					path: path.resolve(self.datastore.gamesPath + "/" + game)
				})
			});
			self.okay({filesList});
			return true;
		});

		return true;
	}
}

module.exports = EditorMethods;
