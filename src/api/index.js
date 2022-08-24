delete require.cache[module.filename];	// always reload

const { app, dialog, shell} = require('electron');
const path = require("path");
const fs = require("fs");
const HERE = path.resolve(__dirname);
const sleepless = require("sleepless");
const L = sleepless.L.mkLog("--- api\t\t")(3);

const DS = require("ds").DS;
const configPath = path.resolve(app.getPath("appData"), ".plankton.config.json");
const datastore = new DS(configPath);

if(!datastore.gamesPath)
{
	datastore.gamesPath = path.resolve(app.getPath("documents"), "PlanktonGames");
	datastore.save();
}

module.exports = async function(input, _okay, _fail)
{
	const {prefix, action} = input;
	
	const okay = function(data)
	{
		_okay({ status: 200, data });
	}
	
	const fail = function(data, statusCode)
	{
		L.E(sleepless.o2j(data) + " prefix: " + prefix);
		_fail({ status: statusCode || 400, data });
	}

	if(!action)
	{
		fail({message: "Action not provided"});
		return false;
	}
	
	if(prefix)
	{
		run(prefix, input, datastore, okay, fail);
		return true;
	}

	L.E("--- Action does not exist: " + action);
	fail({message: "Action does not exist", action}, 501);
	return false;
};

const run = function(prefix, _input, _datastore, _okay, _fail)
{
	const Module = require("./rpc_" + prefix + ".js");
	const prefixModule = new Module(_input, _datastore, _okay, _fail);
	
	L.V(` prefix: ${prefix} | action: ${_input.action}`);
	
	if(prefixModule[_input.action] instanceof Function)
	{
		prefixModule[_input.action]();
		return true;
	}

	_fail({message: "Method not found", action: _input.action});
	return false;
};