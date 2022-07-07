import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.methods(
{
  ping: function()
  {
    console.log("ping", "pong");
    return "pong";
  },
  alabaster: function()
  {
    return "ivory";
  }
});
