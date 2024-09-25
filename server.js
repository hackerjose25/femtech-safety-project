const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors()); // Allow CORS for all origins
app.use(express.static('public')); // Serve static files from 'public' folder

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle location updates from SOS app
    socket.on('locationUpdate', (locationData) => {
        console.log('Location Data:', locationData);
        // Send location data to all connected clients (Police)
        io.emit('locationUpdate', locationData);
    });

    // Handle WebRTC signaling for video stream
    socket.on('signal', (data) => {
        if (data.offer) {
            socket.broadcast.emit('signal', data); // Forward offer to other clients (Police)
        } else if (data.candidate) {
            socket.broadcast.emit('signal', data); // Forward ICE candidates
        } else if (data.answer) {
            socket.broadcast.emit('signal', data); // Forward answer
        }
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});
