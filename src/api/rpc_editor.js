delete require.cache[module.filename];

const {app} = require("electron");
const fs = require("fs");
const path = require("path");
const sleepless = require("sleepless");
const Module = require("./rpc_module");
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

		console.log(app.getAppPath());

		const gamePath = path.resolve(self.datastore.gamesPath, folder);
		const tmpGamePath = path.resolve(app.getAppPath(), "src/static/editor/tmp/currentGame");

		fs.rmSync(tmpGamePath, {recursive: true, force: true});
		
		// todo copy game to tmp and return path
		try{
			await copyDir(gamePath, tmpGamePath);
			self.okay({path: tmpGamePath});
			return true;
		}
		catch(e)
		{
			self.fail({message: "Failed to copy game to local tmp", error: e, action: self.action, gamePath, tmpGamePath});
			return false;
		}
	}
}

module.exports = EditorMethods;
