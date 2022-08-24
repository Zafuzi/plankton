
document.addEventListener("DOMContentLoaded", function()
{
	nav = document.querySelector("nav");
	setActiveNav();
});

function setActiveNav()
{
	if(nav)
	{
		const activeLink = nav.querySelector(`a[data-route="${args.route}"]`);
		if(activeLink)
		{
			activeLink.classList.add("active");
		}
	}

	console.log("Query Args: %o", args);
}
