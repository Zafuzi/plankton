Template.registerHelper("active__ifRouteActive", function(route)
{
    let r = Router.current().route.getName();
    console.log(r);
    return r === route ? "active" : "";
});