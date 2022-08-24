const {app, BrowserWindow, session} = require('electron');
const path = require('path');
const fs = require("fs");

const DS = require("ds").DS;
const datastore = new DS(path.resolve(app.getPath("appData"), ".plankton.config.json"));

if(!datastore.gamesPath)
{
	datastore.gamesPath = path.resolve(app.getPath("documents"), "PlanktonGames");
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

const HERE = require("path").dirname(module.filename);

const expressServer = require("rpc")("/api/", HERE + "/api/", {cors: true, dev: true});
expressServer.use(require("serve-static")(HERE + "/static"));
expressServer.use((req, res, next) =>
{
	res.set({
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
		"Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
		"Content-Security-Policy": "default-src 'self'",
		"X-Content-Security-Policy": "default-src 'self'",
		"X-WebKit-CSP": "default-src 'self'"
	});
	next();
});

// todo move this to a let and function call so we can restart the server if it dies, like on macos when windows get moved to the appbar
const server = expressServer.listen(0, function()
{
	console.log("listening to everything on port: " + server.address().port);
	app.on('ready', createWindow);
});


app.on('web-contents-created', (event, contents) =>
{

	contents.on('will-attach-webview', (event, webPreferences, params) =>
	{
		// Strip away preload scripts if unused or verify their location is legitimate
		delete webPreferences.preload;

		// Disable Node.js integration
		webPreferences.nodeIntegration = false;

		// Verify URL being loaded
		if(!params.src.startsWith(`http://localhost:${server.address().port}`))
		{
			event.preventDefault();
		}
	});

	contents.on('will-navigate', (event, navigationUrl) =>
	{
		const parsedUrl = new URL(navigationUrl);

		if(parsedUrl.origin !== `http://localhost:${server.address().port}`)
		{
			event.preventDefault();
		}
	});
});

let urlFilter = {
	urls: [`http://localhost:${server.address().port}/*`]
}



const createWindow = async function()
{
	const iconPath = process.platform !== 'darwin' ? 'Icon/Icon.ico' : 'Icon/Icon.icns';

	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 1600,
		height: 900,
		icon: path.resolve(__dirname, "./Icon/Icon.icns"),

		webPreferences: {
			preload: path.join(app.getAppPath(), 'src/preload.js'),
			contextIsolation: true,
			nodeIntegration: false,
			nodeIntegrationInWorker: false,
			allowRunningInsecureContent: false
		}
	});


	await mainWindow.loadURL("http://localhost:" + server.address().port);
	mainWindow.setTitle(`Plankton - ${process.env.npm_package_version}`);

	mainWindow.webContents.session.setPermissionRequestHandler((webContents, permission, callback) =>
	{
		if(webContents.getURL() !== `http://localhost:${server.address().port}` && permission === 'openExternal')
		{
			return callback(false);
		}
		else
		{
			return callback(true);
		}
	});

	session.defaultSession.webRequest.onBeforeSendHeaders(urlFilter, (details, callback) => {
		details.requestHeaders['User-Agent'] = 'PlanktonApp'
		callback({ requestHeaders: details.requestHeaders })
	})

	// Open the DevTools.
	// mainWindow.webContents.openDevTools();
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
