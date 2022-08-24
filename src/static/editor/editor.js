console.log(queryData);

let r8_gameName = sleepless.rplc8("#gameName");
	r8_gameName.update({
		name: queryData?.folder || ""
	});
	
sleepless.rpc("/api/", {prefix: "games", action: "getGame", folder: queryData.folder}, function(response)
{
	console.log(response);
}, console.error);