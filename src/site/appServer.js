// always reload
delete require.cache[module.filename];

const HERE = require("path").dirname(module.filename);

const app = require("rpc")("/api/", HERE + "/api/", {cors: true, dev: true});
app.use(require("serve-static")(HERE + "/static"));

app.listen("7891", function()
{
	console.log("listening to everything...");
});

module.exports = app;
