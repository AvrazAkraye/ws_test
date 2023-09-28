const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve a simple HTML page for the Socket.IO client
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Store all connected Socket.IO clients
const clients = new Set();

// Socket.IO server logic
io.on('connection', (socket) => {
  console.log('Client connected');
  
  // Add the newly connected client to the set
  clients.add(socket);

  // Handle incoming messages from the Socket.IO client
  socket.on('message', (message) => {
    console.log(`Received: ${message}`);

    // Broadcast the message to all connected clients
    for (const client of clients) {
      if (client !== socket) {
        client.emit('message', `Server received: ${message}`);
      }
    }
  });

  // Handle client disconnects
  socket.on('disconnect', () => {
    console.log('Client disconnected');
    
    // Remove the disconnected client from the set
    clients.delete(socket);
  });
});

// Start the HTTP server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
