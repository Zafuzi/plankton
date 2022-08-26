let gameFrame = sleepless.QS1("#gameFrame")
let iframe;

let editorStartup = sleepless.runq();

// load the requested game and show the editor
editorStartup.add(function(next)
{
	console.log(queryData);
	
	let r8_gameName = sleepless.rplc8("#gameName");
	r8_gameName.update({
		name: queryData?.gameName || ""
	});

	if(queryData.gameName)
	{
		sleepless.rpc("/api/", {prefix: "editor", action: "getGame", folder: queryData.gameName}, function(response)
		{
			iframe = document.createElement("iframe");
			iframe.height = "1280px";
			iframe.width = "720px";
			iframe.src = "tmp/currentGame/index.html";
			iframe.addEventListener("load", function(event)
			{
				scaleGameFrame();
				sleepless.QS1("#editor").style.opacity = 1;
			});
			
			console.log(iframe);
			
			gameFrame.appendChild(iframe);
			
			console.log(response);
			next();
		}, console.error);
	}
	else
	{
		next();
	}
});

// setup button listeners
editorStartup.add(function()
{
	listen("#reloadGame", "click", function()
	{
		iframe.contentWindow.location.reload();
		scaleGameFrame();
	});
})

editorStartup.run(function()
{
})


let scaleTries = 0;
const scaleGameFrame = function()
{
	let iframe = gameFrame.querySelector("iframe");
	
	if(scaleTries >= 5)
	{
		console.error("Could not load canvas from iFrame!");
		return false;
	}
	
	let canvas = iframe.contentDocument.getElementsByTagName("canvas")[0];
	
	if(!canvas?.width)
	{
		console.log("try again");
		setTimeout(function()
		{
			scaleGameFrame();
			scaleTries += 1;
		}, 100);
		
		return false;
	}
	
	let canvas__space = canvas.getBoundingClientRect();
	let gameFrame__space = gameFrame.getBoundingClientRect();
	let iframe__space = iframe.getBoundingClientRect();
	
	let ratio = canvas__space.width / canvas__space.height;
	
	iframe.style.width = gameFrame__space.width + "px";
	iframe.style.height = gameFrame__space.width / ratio + "px";
}

window.addEventListener("resize", function()
{
	scaleGameFrame();
});
