'use strict';

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
function generateUsername() {
    let newUser;

    // Random 4 digit number
    // var val = Math.floor(1000 + Math.random() * 9000);
    // console.log(val);

    if (!users.length == 0) {
        users.forEach((user) => {
            let username = user.username;
            let number = username.split('#')[1];

            if (number > highestID) {
                highestID = Number(number);
            }
        });

        newUser = `Guest#${highestID + 1}`;
    } else {
        newUser = `Guest#${highestID}`;
    }

    highestID + 1;
    users.push({ username: newUser });
    return newUser;
}

function broadcast(server, message) {
    server.clients.forEach((client) => {
        if (client.readyState == WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

function sendPrivate(websocket, message) {
    websocket.send(JSON.stringify(message));
}

function logMessage(message){
    chatHistory.push(message.payload);
}

let users = [];
let chatHistory = [];

server.on('connection', (websocket) => {
    console.log('Someone connected');
    const new_user = generateUsername();
    sendPrivate(websocket, { action: 'user:name', payload: new_user });
    broadcast(server, { action: 'user:connection', payload: new_user });
    broadcast(server, { action: 'user:list', payload: users });
    sendPrivate(websocket, {action: 'chat:history', payload: chatHistory});

    // Listen to the `message` event
    websocket.on('message', (message) => {
        console.log('Someone messaged');
        const parsedMessage = JSON.parse(message);
        logMessage(parsedMessage);
        broadcast(server, {action: parsedMessage.action, payload: parsedMessage.payload});
    });

    // Listen to the `close` event
    websocket.on('close', (code, reason) => {
        console.log('Someone disconnected');
        const data = JSON.parse(reason);

        users = users.filter((user) => user.username !== data.payload);
        broadcast(server, { action: 'user:list', payload: users });
        broadcast(server, {
            action: data.action,
            payload: data.payload,
        });
    });
});

server.on('listening', () => {
    console.log(`Starting a WS server @ localhost:4000`);
});
