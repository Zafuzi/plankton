import "../templateHelpers";

Template.layout.helpers(
{

});

Template.layout.events(
{
    "click .backButton": function()
    {
        console.log("goback")
        window.history.back();
    },
    "click .forwardButton": function()
    {
        window.history.forward();
    }
});