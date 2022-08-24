console.log(queryData);

let r8_gameName = sleepless.rplc8("#gameName");
	r8_gameName.update({
		name: queryData?.folder || ""
	});
	
sleepless.rpc("/api/", {prefix: "editor", action: "getGame", folder: queryData?.folder}, function(response)
{
	let frame = document.createElement("iframe");
		frame.width = "800";
		frame.height = "600";
		frame.src = "../tmp_currentGame/index.html";
		
		sleepless.QS1("#gameFrame").innerHTML = frame.outerHTML;
		
	console.log(response);
}, console.error);