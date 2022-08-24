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
	<nav class="flex flow-row align-center gap-16">
		<a class="${isActiveRoute("/")}" href="/">Dashboard</a>
		<a class="${isActiveRoute("/editor")}" href="/editor">Editor</a>
		<a class="${isActiveRoute("/help")}" href="/help">Help</a>
	</nav>
`;

document.body.prepend(header);