const {app, BrowserWindow} = require('electron');
const path = require('path');
const fs = require("fs");

const DS = require("ds").DS;
const datastore = new DS(path.resolve(process.env.USERPROFILE + "/.planktonConfig.json"));

if(!datastore.gamesPath)
{
	datastore.gamesPath = path.resolve(process.env.USERPROFILE + "\\Documents\\PlanktonGames");
	datastore.save();
}
const DEFAULT_GAMES_DIR = datastore.gamesPath;

fs.readdir(datastore.gamesPath, function(error, result)
{
	if(error && error.code === "ENOENT")
	{
		console.log("games folder does not exist, creating");
		fs.mkdir(datastore.gamesPath, function(error, result)
		{
			if(error)
			{
				console.error("failed to create games directory", error, result);
			}
		});
	}
});


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if(require('electron-squirrel-startup'))
{ // eslint-disable-line global-require
	app.quit();
}

const HERE = require("path").dirname(module.filename);

const expressServer = require("rpc")("/api/", HERE + "/api/", {cors: true, dev: true});
expressServer.use(require("serve-static")(HERE + "/static"));

// todo move this to a let and function call so we can restart the server if it dies, like on macos when windows get moved to the appbar
const server = expressServer.listen(0, function()
{
	console.log("listening to everything on port: " + server.address().port);
	app.on('ready', createWindow);
});

const createWindow = () =>
{
	const iconPath = process.platform !== 'darwin' ? 'Icon/Icon.ico' : 'Icon/Icon.icns';
	
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 1600,
		height: 900,
		icon: path.resolve(__dirname, "./Icon/Icon.icns")
	});
	
	mainWindow.loadURL("http://localhost:" + server.address().port);

	// Open the DevTools.
	mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () =>
{
	if(process.platform !== 'darwin')
	{
		app.quit();
	}
});

app.on('activate', () =>
{
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if(BrowserWindow.getAllWindows().length === 0)
	{
		createWindow();
	}
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
