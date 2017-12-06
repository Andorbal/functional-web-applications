// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
var phoenix = require("phoenix");
//import "phoenix_html";

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

// import socket from "./socket"

window.socket = new phoenix.Socket("/socket", {});
window.socket.connect();

window.new_channel = function(subtopic, screen_name) {
  return socket.channel("game:" + subtopic, { screen_name: screen_name });
};

window.join = function(channel) {
  channel
    .join()
    .receive("ok", response => {
      console.log("Joined successfully!", response);
    })
    .receive("error", response => {
      console.log("Unable to join", response);
    });
};

window.leave = function(channel) {
  channel
    .leave()
    .receive("ok", response => {
      console.log("Left successfully", response);
    })
    .receive("error", response => {
      console.log("Unable to leave", response);
    });
};

window.say_hello = function(channel, greeting) {
  channel
    .push("hello", { message: greeting })
    .receive("ok", response => {
      console.log("Hello", response.message);
    })
    .receive("error", response => {
      console.log("Unable to say hello to the channel.", response.message);
    });
};

window.start = function(name) {
  var game_channel = new_channel("moon", name);
  window.join(game_channel);

  game_channel.on("said_hello", response => {
    console.log("Returned Greeting:", response.message);
  });

  return game_channel;
};
