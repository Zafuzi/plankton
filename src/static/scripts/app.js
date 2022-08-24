// globals can go here
const queryData = sleepless.getQueryData();
const currentRoute = "/" + window.location.pathname.split("/")[1];

let header = document.createElement("header")
const isActiveRoute = function(route)
{
	if(currentRoute === route)
	{
		return "active";
	}
	
	return "";
}

header.innerHTML = `
	<nav>
		<a class="${isActiveRoute("/")}" href="/">Dashboard</a>
		<a class="${isActiveRoute("/editor") ? " active" : " hid"}" href="/editor">Editor</a>
		<a class="${isActiveRoute("/help")}" href="/help">Help</a>
	</nav>
`;

document.body.prepend(header);

const okay = function(response)
{
	console.log(`${response.status} | ${response.message}`, response.data);
}

const fail = function(response)
{
	console.error(`${response.status} | ${response.message}`, response.error, response.data);
}

const rpc = function(data, _okay, _fail)
{
	sleepless.rpc("/api/", data, _okay || okay, _fail || fail);
}

const listen = function(selector, eventType, onEventFunction)
{
	if(!selector || !eventType || !onEventFunction || !(onEventFunction instanceof Function))
	{
		return false;
	}
	
	let element = sleepless.QS(selector);
	if(!element)
	{
		return false;
	}
	
	if(element.length > 1)
	{
		element.forEach(function(e)
		{
			e.addEventListener(eventType, onEventFunction);
		});
	}
	else
	{
		element.forEach(function(e)
		{
			e.addEventListener(eventType, onEventFunction);
		});
	}
	
	return true;
}