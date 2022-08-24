delete require.cache[module.filename];

const Module = require("./rpc_module");
const fs = require("fs");
const path = require("path");
const sleepless = require("sleepless");
const {copyDir} = require("./fs_extra");
const L = sleepless.L.mkLog("--- Editor\t\t")(5);

class EditorMethods extends Module
{
	
	constructor(_input, _datastore, _okay, _fail)
	{
		super(_input, _datastore, _okay, _fail);
	}
	
	async getGame()
	{
		let self = this;
		
		L.V(sleepless.o2j(self.input));

		const {folder} = self.input;
		if(!folder)
		{
			self.fail({message: "No game folder provided"});
			return false;
		}

		const gamePath = path.resolve(self.datastore.gamesPath, folder);

		fs.rmSync(path.resolve(__dirname, "../static/tmp_currentGame"), {recursive: true, force: true});
		
		// todo copy game to tmp and return path
		try{
			await copyDir(gamePath, path.resolve(__dirname, "../static/tmp_currentGame"));
			self.okay({path: gamePath});
			return true;
		}
		catch(e)
		{
			self.fail({message: "Failed to copy game to local tmp", error: e, action: self.action});
			return false;
		}
	}
}

module.exports = EditorMethods;