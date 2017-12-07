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

window.new_channel = function(player, screen_name) {
  return socket.channel("game:" + player, { screen_name: screen_name });
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

window.new_game = function(channel) {
  channel
    .push("new_game")
    .receive("ok", response => console.log("New Gmae!", response))
    .receive("error", response =>
      console.log("Unable to start a new game.", response)
    );
};

window.add_player = function(channel, player) {
  channel
    .push("add_player", player)
    .receive("error", response =>
      console.log("Unable to add new player: " + player, response)
    );
};

window.position_island = function(channel, player, island, row, col) {
  var params = {
    player: player,
    island: island,
    row: row,
    col: col
  };

  channel
    .push("position_island", params)
    .receive("ok", response => {
      console.log("Island positioned!", response);
    })
    .receive("error", response => {
      console.log("Unable to position island.", response);
    });
};

window.set_islands = function(channel, player) {
  channel
    .push("set_islands", player)
    .receive("ok", response => {
      console.log("Here is the board");
      console.dir(response.board);
    })
    .receive("error", response => {
      console.log("Unable to set islands for: " + player, response);
    });
};

window.guess_coordinate = function(channel, player, row, col) {
  var params = {
    player: player,
    row: row,
    col: col
  };

  channel.push("guess_coordinate", params).receive("error", response => {
    console.log("Unable to guess a coordinate: " + player, response);
  });
};

window.start = function(name) {
  var game_channel = new_channel("moon", name);
  window.join(game_channel);

  game_channel.on("said_hello", response => {
    console.log("Returned Greeting:", response.message);
  });
  game_channel.on("player_added", response => {
    console.log("Player Added", response);
  });
  game_channel.on("player_set_islands", response => {
    console.log("Player Set Islands", response);
  });
  game_channel.on("player_guessed_coordinate", response => {
    console.log("Player Guessed Coordinate: ", response.result);
  });
  game_channel.on("subscribers", response => {
    console.log("These players have joined: ", response);
  });

  return game_channel;
};
