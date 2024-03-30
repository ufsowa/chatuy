const express = require('express');
const app = express();
const socket = require('socket.io');

const path = require('path');

const messages = [];
let users = [];

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/client')));

// host client UI
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/index.html'));
});

const server = app.listen(8000, () => {
    console.log('Server running on port 8000')
});

const io = socket(server);  // integrate websocket io module with running server

io.on('connection', (socket) => {
    console.log('New client! Its id – ' + socket.id);
    socket.on('login', (user) => {
        console.log('new user logged ', user, socket.id);
        users.push({...user, id: socket.id});
        socket.broadcast.emit('addUser', { name: user.name });
    })
    socket.on('message', (message) => {
        console.log('Oh, I\'ve got something from ' + socket.id);
        messages.push(message);
//        socket.emit('message', message)   // emit event to socket client
//        io.to('IIr5o6g-jQDfK3vcAAAC').emit('message', 'For your eyes only!'); // emit event to client with id
        socket.broadcast.emit('message', message);  // emit event to all connected clients expect this 
      });
    socket.on('disconnect', () => {
       let removedUser = {};
        users = users.filter(user => {
            if(user.id === socket.id) {
                removedUser = user;
                return false;
            }
            return true});
        socket.broadcast.emit('removeUser', { name: removedUser.name });
        console.log('Remove user: ', removedUser);
        console.log('Oh, socket ' + socket.id + ' has left', users);
    });
    console.log('I\'ve added a listener on message event \n');
});

// io.emit('message', message); // emits event to all connected clients

