"use strict";

// HTTP Stuff
const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.listen(port, () => {
  console.log(`Starting a HTTP server @ localhost:${port}`);
});

// WebSocket Stuff
const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 4000 });

// Generates a random user name on user connection
let highestID = 0;
function generateUsername(){
    let newUser

    if (!users.length == 0) {
        users.forEach(user => {
            let username = user.username;
            let number = username.split('#')[1];
            
            if (number > highestID) {
                highestID = Number(number);
            }
        })
        
        newUser = `Guest#${highestID + 1}`;

    } else {
        newUser = `Guest#${highestID}`;
    }
    
    highestID + 1;
    users.push({username: newUser});
    return newUser;
}



function broadcast(server, message){
    server.clients.forEach((client) => {
        if (client.readyState == WebSocket.OPEN) {
            client.send(message);
        }
    })
}

let users = [];
let chatHistory = [];

server.on('connection', (websocket) => {
  console.log('Someone connected');
  const new_user = generateUsername()
  broadcast(server, new_user);
    console.log(users);

  // Listen to the `message` event
  websocket.on('message', (message) => {
    console.log('Someone messaged');
  });

  // Listen to the `close` event
  websocket.on('close', () => {
    console.log('Someone disconnected');
  });
});

server.on('listening', () => {
  console.log(`Starting a WS server @ localhost:4000`);
});


