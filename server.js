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
function generateUsername(){

}

let users = [];
let chatHistory = [];

server.on('connection', (websocket) => {
  console.log('Someone connected');

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


